import { supabase } from '../lib/supabase';
import type { GeneratedSchema, SchemaKind } from './schema';
import type { FormValues } from './runtime';

/**
 * Data access layer (Fase 5 — R-024/R-025).
 * Reads/writes `bussiness.form_masters`, `bussiness.form_transactions`, and
 * `bussiness.workflows` via Supabase. If the Supabase migration has not been
 * applied yet, calls throw — screens map that to a "database not ready"
 * notice.
 */

export interface FormSchemaRecord {
  id: string;
  name: string;
  kind: SchemaKind;
  schema: GeneratedSchema;
  created_at: string;
}

export interface TransactionRecord {
  id: string;
  form_id: string;
  form_name: string;
  data: FormValues;
  created_at: string;
}

export interface WorkflowRecord {
  id: string;
  name: string;
  definition: GeneratedSchema;
  created_at: string;
}

interface DbFormRow {
  id: string;
  name: string;
  kind: string;
  schema_json: unknown;
  created_at: string;
}

interface DbTxRow {
  id: string;
  form_id: string;
  data: unknown;
  created_at: string;
}

interface DbWorkflowRow {
  id: string;
  name: string;
  definition: unknown;
  created_at: string;
}

function parseSchemaJson(raw: unknown): GeneratedSchema | null {
  if (!raw || typeof raw !== 'object') return null;
  const schema = raw as Partial<GeneratedSchema>;
  if (!schema.name || !Array.isArray(schema.fields)) return null;
  return schema as GeneratedSchema;
}

export async function listFormSchemas(): Promise<FormSchemaRecord[]> {
  const { data, error } = await supabase
    .schema('bussiness')
    .from('form_masters')
    .select('id, name, kind, schema_json, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as DbFormRow[];
  return rows.flatMap((row) => {
    const schema = parseSchemaJson(row.schema_json);
    if (!schema) return [];
    return [
      {
        id: row.id,
        name: row.name,
        kind: (row.kind as SchemaKind) ?? schema.kind,
        schema,
        created_at: row.created_at,
      },
    ];
  });
}

export async function deleteFormSchema(id: string): Promise<void> {
  const { error } = await supabase.schema('bussiness').from('form_masters').delete().eq('id', id);
  if (error) throw error;
}

export async function listWorkflows(): Promise<WorkflowRecord[]> {
  const { data, error } = await supabase
    .schema('bussiness')
    .from('workflows')
    .select('id, name, definition, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as DbWorkflowRow[];
  return rows.flatMap((row) => {
    const definition = parseSchemaJson(row.definition);
    if (!definition) return [];
    return [{ id: row.id, name: row.name, definition, created_at: row.created_at }];
  });
}

export async function deleteWorkflow(id: string): Promise<void> {
  const { error } = await supabase.schema('bussiness').from('workflows').delete().eq('id', id);
  if (error) throw error;
}

export async function listTransactions(): Promise<TransactionRecord[]> {
  const { data, error } = await supabase
    .schema('bussiness')
    .from('form_transactions')
    .select('id, form_id, data, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as DbTxRow[];

  // Resolve form names for display.
  const { data: forms } = await supabase
    .schema('bussiness')
    .from('form_masters')
    .select('id, name');
  const nameById = new Map<string, string>((forms ?? []).map((f) => [f.id, f.name]));

  return rows.map((row) => ({
    id: row.id,
    form_id: row.form_id,
    form_name: nameById.get(row.form_id) ?? '—',
    data: (row.data ?? {}) as FormValues,
    created_at: row.created_at,
  }));
}

export async function insertTransaction(formId: string, data: FormValues): Promise<void> {
  const { error } = await supabase
    .schema('bussiness')
    .from('form_transactions')
    .insert({ form_id: formId, data });
  if (error) throw error;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.schema('bussiness').from('form_transactions').delete().eq('id', id);
  if (error) throw error;
}
