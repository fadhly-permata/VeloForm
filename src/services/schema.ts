/**
 * VeloForm schema model + AI generation/refinement (Fase 3 — WP-11..WP-13).
 *
 * Generation & refinement call the active AI provider's OpenAI-compatible
 * `/chat/completions` endpoint (OpenRouter, OpenAI, LiteLLM, ...) and ask it to
 * return a strict JSON schema. API key comes from secure storage.
 */

export type SchemaKind = 'master' | 'transaction' | 'report' | 'workflow';

export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'boolean'
  | 'email'
  | 'currency';

export interface SchemaField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number | boolean;
  /** Conditional visibility (ON_CHANGE callback): show only when another field equals this value. */
  visibleWhen?: { field: string; equals: string };
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'decision';
  /** action step: instruction; `{{field_id}}` is replaced with the form value. */
  action?: string;
  /** decision step: field to compare. */
  field?: string;
  /** decision step: value to match (string comparison). */
  equals?: string;
  then?: WorkflowStep[];
  else?: WorkflowStep[];
}

export interface GeneratedSchema {
  version: number;
  kind: SchemaKind;
  name: string;
  description?: string;
  fields: SchemaField[];
  /** workflow-only: what triggers the flow. */
  trigger?: string;
  /** workflow-only: plain-language summary of the steps. */
  actions?: string[];
  /** workflow-only: executable steps (action/decision nodes — R-023). */
  steps?: WorkflowStep[];
}

export interface AiProviderConfig {
  id: string;
  baseUrl: string;
  model: string;
}

export type SchemaErrorCode =
  | 'no_provider'
  | 'no_key'
  | 'http'
  | 'network'
  | 'parse'
  | 'empty'
  | 'unknown';

export type SchemaResult =
  | { ok: true; schema: GeneratedSchema }
  | { ok: false; code: SchemaErrorCode; message: string; status?: number };

/** Fallback model for OpenAI-compatible endpoints when the provider has none. */
const FALLBACK_MODEL = 'openai/gpt-4o-mini';

const FIELD_TYPES =
  'text | number | textarea | select | date | boolean | email | currency';

const JSON_SHAPE = `{
  "version": 1,
  "kind": "<master|transaction|report|workflow>",
  "name": "<short title>",
  "description": "<one sentence>",
  "fields": [
    {
      "id": "<unique lowercase id, e.g. field_1>",
      "label": "<user-facing label>",
      "type": "<${FIELD_TYPES}>",
      "required": false,
      "placeholder": "<optional>",
      "options": ["<only for type select>"],
      "defaultValue": "<optional>"
    }
  ]
}`;

function buildSystemPrompt(kind: SchemaKind, currentSchema?: GeneratedSchema | null): string {
  const base = [
    `You are VeloForm, an AI that designs app schemas for a business forms product.`,
    `Return ONLY valid JSON (no markdown, no code fences, no commentary) matching EXACTLY this shape:`,
    JSON_SHAPE,
    `Rules:`,
    `- "kind" must be "${kind}".`,
    `- Field "id" values must be unique and lowercase with underscores.`,
    `- "type" must be one of: ${FIELD_TYPES}.`,
    `- Use "options" (array of strings) only for type "select".`,
    `- Field labels must be concise and user-facing.`,
  ];
  if (kind === 'workflow') {
    base.push(
      `For kind "workflow" ALSO include: "trigger" (one sentence describing what starts the flow).`,
      `"steps": an array of executable steps (2-5). Each step is either:`,
      `  { "id": "step_1", "type": "action", "action": "<instruction, may reference form values as {{field_id}}>" }`,
      `  or a decision node: { "id": "step_2", "type": "decision", "field": "<field_id>", "equals": "<value>", "then": [<steps>], "else": [<steps>] }`,
      `Also include "actions": a short plain-language summary of the steps.`,
      `For workflow, "fields" represent the form inputs needed before the flow runs.`
    );
  }
  base.push(
    `You may also use "visibleWhen": { "field": "<other field id>", "equals": "<value>" } on a field to show it only when the other field equals that value.`
  );
  if (currentSchema) {
    base.push(
      `The user will ask to refine the CURRENT schema below. Apply the requested change and return the COMPLETE updated schema JSON (all fields, including ones you did not change).`,
      `CURRENT SCHEMA:`,
      JSON.stringify(currentSchema, null, 2)
    );
  }
  return base.join('\n');
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in response');
  }
  return candidate.slice(start, end + 1);
}

async function chatCompletion(
  provider: AiProviderConfig,
  apiKey: string,
  systemPrompt: string,
  userContent: string,
  timeoutMs = 30_000
): Promise<{ ok: boolean; content: string; status?: number; message: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model.trim() || FALLBACK_MODEL,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { ok: false, content: '', status: res.status, message: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content ?? '';
    return { ok: true, content, message: '' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('aborted')) {
      return { ok: false, content: '', message: 'Request timed out' };
    }
    if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
      return { ok: false, content: '', message: 'Network error (CORS or offline)' };
    }
    return { ok: false, content: '', message };
  } finally {
    clearTimeout(timer);
  }
}

/** Generate a brand-new schema from a prompt. */
export async function generateSchema(
  kind: SchemaKind,
  prompt: string,
  provider: AiProviderConfig,
  apiKey: string
): Promise<SchemaResult> {
  const response = await chatCompletion(provider, apiKey, buildSystemPrompt(kind), prompt);
  if (!response.ok) {
    return {
      ok: false,
      code: response.status ? 'http' : 'network',
      message: response.message,
      status: response.status,
    };
  }
  return parseSchemaResult(response.content, kind);
}

/** Refine an existing schema using a natural-language instruction. */
export async function refineSchema(
  schema: GeneratedSchema,
  instruction: string,
  provider: AiProviderConfig,
  apiKey: string
): Promise<SchemaResult> {
  const response = await chatCompletion(
    provider,
    apiKey,
    buildSystemPrompt(schema.kind, schema),
    instruction
  );
  if (!response.ok) {
    return {
      ok: false,
      code: response.status ? 'http' : 'network',
      message: response.message,
      status: response.status,
    };
  }
  return parseSchemaResult(response.content, schema.kind);
}

function parseSchemaResult(content: string, kind: SchemaKind): SchemaResult {
  try {
    const json = JSON.parse(extractJson(content)) as Partial<GeneratedSchema>;
    const fields = Array.isArray(json.fields)
      ? json.fields.filter(
          (f): f is SchemaField =>
            !!f && typeof f === 'object' && typeof f.id === 'string' && typeof f.label === 'string'
        )
      : [];
    if (!json.name || fields.length === 0) {
      return { ok: false, code: 'empty', message: 'Schema is empty' };
    }
    const schema: GeneratedSchema = {
      version: 1,
      kind: json.kind === kind ? kind : kind,
      name: json.name,
      description: typeof json.description === 'string' ? json.description : undefined,
      fields: fields.map((f) => ({
        id: f.id,
        label: f.label,
        type: validFieldType(f.type),
        required: !!f.required,
        placeholder: typeof f.placeholder === 'string' ? f.placeholder : undefined,
        options: Array.isArray(f.options) ? f.options.filter((o): o is string => typeof o === 'string') : undefined,
        defaultValue: f.defaultValue,
        visibleWhen: f.visibleWhen && typeof f.visibleWhen === 'object'
          ? { field: String(f.visibleWhen.field ?? ''), equals: String(f.visibleWhen.equals ?? '') }
          : undefined,
      })),
      trigger: typeof json.trigger === 'string' ? json.trigger : undefined,
      actions: Array.isArray(json.actions)
        ? json.actions.filter((a): a is string => typeof a === 'string')
        : undefined,
      steps: Array.isArray(json.steps) ? json.steps.map(normalizeStep) : undefined,
    };
    return { ok: true, schema };
  } catch (error) {
    return {
      ok: false,
      code: 'parse',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function normalizeStep(raw: unknown, index = 0): WorkflowStep {
  const s = (raw ?? {}) as Partial<WorkflowStep>;
  const step: WorkflowStep = {
    id: typeof s.id === 'string' && s.id ? s.id : `step_${index + 1}`,
    type: s.type === 'decision' ? 'decision' : 'action',
    action: typeof s.action === 'string' ? s.action : undefined,
    field: typeof s.field === 'string' ? s.field : undefined,
    equals: typeof s.equals === 'string' ? s.equals : undefined,
    then: Array.isArray(s.then) ? s.then.map((c, i) => normalizeStep(c, i)) : undefined,
    else: Array.isArray(s.else) ? s.else.map((c, i) => normalizeStep(c, i)) : undefined,
  };
  return step;
}

function validFieldType(type: unknown): FieldType {
  const known: FieldType[] = [
    'text',
    'number',
    'textarea',
    'select',
    'date',
    'boolean',
    'email',
    'currency',
  ];
  return typeof type === 'string' && (known as string[]).includes(type)
    ? (type as FieldType)
    : 'text';
}
