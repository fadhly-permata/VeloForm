import { getAppDb } from '../db/db';

/**
 * Local task queue (Fase 4 — R-022).
 *
 * Tasks are persisted in `app_data.db` (`task_queue`) and processed by an
 * in-app scheduler (see `startQueueScheduler`). OS-level background execution
 * while the app is closed (expo-background-fetch) is intentionally deferred —
 * it needs real-device testing.
 */

export type TaskStatus = 'pending' | 'done' | 'error';

export interface QueuedTask {
  id: string;
  name: string;
  payload: Record<string, unknown>;
  runAt: number;
  status: TaskStatus;
  result: string | null;
}

interface DbTaskRow {
  id: string;
  name: string;
  payload: string;
  run_at: number;
  status: string;
  result: string | null;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapTask(row: DbTaskRow): QueuedTask {
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(row.payload) as Record<string, unknown>;
  } catch {
    payload = {};
  }
  return {
    id: row.id,
    name: row.name,
    payload,
    runAt: row.run_at,
    status: row.status === 'done' || row.status === 'error' ? row.status : 'pending',
    result: row.result,
  };
}

/** Enqueue a task to run at a given epoch-millis time. */
export async function scheduleTask(
  name: string,
  payload: Record<string, unknown> = {},
  runAt: number = Date.now()
): Promise<void> {
  const db = await getAppDb();
  await db.runAsync(
    `INSERT INTO task_queue (id, name, payload, run_at, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
    newId(),
    name,
    JSON.stringify(payload),
    runAt
  );
}

/** Run all due pending tasks. `executor` may perform side effects; its return
 *  value is stored as the task result. */
export async function processDueTasks(
  executor: (task: QueuedTask) => Promise<string> = async () => 'executed'
): Promise<string[]> {
  const db = await getAppDb();
  const due = await db.getAllAsync<DbTaskRow>(
    `SELECT id, name, payload, run_at, status, result FROM task_queue
     WHERE status = 'pending' AND run_at <= ? ORDER BY run_at ASC`,
    Date.now()
  );
  const processed: string[] = [];
  for (const row of due) {
    const task = mapTask(row);
    try {
      const result = await executor(task);
      await db.runAsync(
        `UPDATE task_queue SET status = 'done', result = ?, ran_at = CURRENT_TIMESTAMP WHERE id = ?`,
        result,
        task.id
      );
      processed.push(task.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await db.runAsync(
        `UPDATE task_queue SET status = 'error', result = ?, ran_at = CURRENT_TIMESTAMP WHERE id = ?`,
        message,
        task.id
      );
    }
  }
  return processed;
}

export async function listTasks(limit = 20): Promise<QueuedTask[]> {
  const db = await getAppDb();
  const rows = await db.getAllAsync<DbTaskRow>(
    `SELECT id, name, payload, run_at, status, result FROM task_queue
     ORDER BY run_at DESC LIMIT ?`,
    limit
  );
  return rows.map(mapTask);
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
