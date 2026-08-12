import type { GeneratedSchema, WorkflowStep } from './schema';
import type { FormValues } from './runtime';

/**
 * Workflow execution engine (Fase 4 — R-023).
 * Walks a workflow's `steps` (action / decision nodes), resolves `{{field_id}}`
 * templates from form input, and produces a run log. Queue logs are persisted
 * by the caller (best-effort to Supabase usage.app_events).
 */

export interface RunLogEntry {
  id: string;
  stepId: string;
  label: string;
  detail: string;
  status: 'ok';
  depth: number;
}

export interface WorkflowRunResult {
  logs: RunLogEntry[];
  summary: string;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveTemplate(text: string | undefined, input: FormValues): string {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(input[key] ?? ''));
}

/** Flatten a workflow's steps into an executable list (falls back to `actions`). */
function flattenSteps(workflow: GeneratedSchema): WorkflowStep[] {
  if (workflow.steps && workflow.steps.length > 0) return workflow.steps;
  return (workflow.actions ?? []).map((action, i) => ({
    id: `step_${i + 1}`,
    type: 'action' as const,
    action,
  }));
}

export function runWorkflow(
  workflow: GeneratedSchema,
  input: FormValues
): WorkflowRunResult {
  const logs: RunLogEntry[] = [];

  const walk = (steps: WorkflowStep[], depth: number) => {
    for (const step of steps) {
      if (step.type === 'decision') {
        const actual = String(input[step.field ?? ''] ?? '');
        const expected = step.equals ?? '';
        const matched = actual === expected;
        logs.push({
          id: newId(),
          stepId: step.id,
          label: `${step.field ?? ''} == ${expected}`,
          detail: matched ? 'true' : 'false',
          status: 'ok',
          depth,
        });
        walk(matched ? step.then ?? [] : step.else ?? [], depth + 1);
      } else {
        const resolved = resolveTemplate(step.action, input);
        logs.push({
          id: newId(),
          stepId: step.id,
          label: step.action ?? '',
          detail: resolved,
          status: 'ok',
          depth,
        });
      }
    }
  };

  walk(flattenSteps(workflow), 0);
  return { logs, summary: `${logs.length} step(s)` };
}
