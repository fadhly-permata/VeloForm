import { supabase } from '../lib/supabase';

/**
 * AI provider configurations over Supabase `logic.ai_providers` (R-035).
 * Replaces the local SQLite `ai_providers` table. API keys are NOT stored
 * here — they stay in device secure storage (WP-09).
 */

export interface AiProviderRow {
  id: string;
  type: string;
  name: string;
  baseUrl: string;
  model: string;
  isActive: boolean;
}

interface DbRow {
  id: string;
  type: string;
  name: string;
  base_url: string;
  model: string | null;
  is_active: boolean;
}

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function mapRow(row: DbRow): AiProviderRow {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    baseUrl: row.base_url,
    model: row.model ?? '',
    isActive: !!row.is_active,
  };
}

export async function getAiProviders(): Promise<AiProviderRow[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('ai_providers')
    .select('id, type, name, base_url, model, is_active')
    .order('created_at');
  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(mapRow);
}

export async function upsertAiProvider(row: AiProviderRow): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('Not signed in');
  const { error } = await supabase.from('ai_providers').upsert(
    {
      id: row.id,
      user_id: userId,
      type: row.type,
      name: row.name,
      base_url: row.baseUrl,
      model: row.model,
      is_active: row.isActive,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

export async function deleteAiProvider(id: string): Promise<void> {
  const { error } = await supabase.from('ai_providers').delete().eq('id', id);
  if (error) throw error;
}

export async function setActiveAiProvider(id: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('Not signed in');
  await supabase.from('ai_providers').update({ is_active: false }).eq('user_id', userId);
  const { error } = await supabase
    .from('ai_providers')
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}
