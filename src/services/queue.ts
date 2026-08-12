import { supabase } from '../lib/supabase';

/**
 * Local task queue (Fase 4 — R-022), migrated to Supabase `logic.task_queue`
 * (R-035). Tasks are per-user and processed by an in-app scheduler. OS-level
 * background execution while the app is closed (expo-background-fetch) is
 * deferred — it needs real-device testing.
 */

export type TaskStatus = 'pending' | 'done' | 'error';

export interface QueuedTask {
  id: string;
  name: string;
  payload: Record<string, unknown>;
  /** Epoch millis when the task becomes due. */
  runAt: number;
  status: TaskStatus;
  result: string | null;
}

interface DbRow {
  id: string;
  name: string;
  payload: unknown;
  run_at: string;
  status: string;
  result: string | null;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapTask(row: DbRow): QueuedTask {
  let payload: Record<string, unknown> = {};
  if (row.payload && typeof row.payload === 'object') {
    payload = row.payload as Record<string, unknown>;
  }
  return {
    id: row.id,
    name: row.name,
    payload,
    runAt: new Date(row.run_at).getTime(),
    status: row.status === 'done' || row.status === 'error' ? row.status : 'pending',
    result: row.result,
  };
}

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Enqueue a task to run at a given epoch-millis time. */
export async function scheduleTask(
  name: string,
  payload: Record<string, unknown> = {},
  runAt: number = Date.now()
): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  const { error } = await supabase.from('task_queue').insert({
    id: newId(),
    user_id: userId,
    name,
    payload,
    run_at: new Date(runAt).toISOString(),
    status: 'pending',
  });
  if (error) throw error;
}

/** Run all due pending tasks. `executor` may perform side effects; its return
 *  value is stored as the task result. */
export async function processDueTasks(
  executor: (task: QueuedTask) => Promise<string> = async () => 'executed'
): Promise<string[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('task_queue')
    .select('id, name, payload, run_at, status, result')
    .eq('status', 'pending')
    .lte('run_at', new Date().toISOString())
    .order('run_at')
    .limit(50);
  if (error) throw error;

  const processed: string[] = [];
  for (const row of data ?? []) {
    const task = mapTask(row as DbRow);
    try {
      const result = await executor(task);
      await supabase
        .from('task_queue')
        .update({ status: 'done', result, ran_at: new Date().toISOString() })
        .eq('id', task.id);
      processed.push(task.id);
    } catch (execError) {
      const message = execError instanceof Error ? execError.message : String(execError);
      await supabase
        .from('task_queue')
        .update({ status: 'error', result: message, ran_at: new Date().toISOString() })
        .eq('id', task.id);
    }
  }
  return processed;
}

export async function listTasks(limit = 20): Promise<QueuedTask[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('task_queue')
    .select('id, name, payload, run_at, status, result')
    .order('run_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(mapTask);
}

/**
 * Lightweight in-app scheduler: processes due tasks on an interval while the
 * app is running. Returns an unsubscribe function.
 */
export function startQueueScheduler(intervalMs = 15_000): () => void {
  const timer = setInterval(() => {
    processDueTasks().catch((error) => console.warn('Queue scheduler tick failed:', error));
  }, intervalMs);
  // Process anything due right away.
  processDueTasks().catch((error) => console.warn('Queue scheduler init failed:', error));
  return () => clearInterval(timer);
}
