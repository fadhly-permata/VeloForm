import { supabase } from '../lib/supabase';

/**
 * User preferences over Supabase `logic.user_preferences` (R-035).
 * Replaces the local SQLite `user_preferences` table. Keyed per auth user;
 * before login there is no persistence (in-memory defaults are used).
 */

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getPreference(key: string): Promise<string | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from('user_preferences')
    .select('pref_value')
    .eq('user_id', userId)
    .eq('pref_key', key)
    .maybeSingle();
  if (error) throw error;
  return data?.pref_value ?? null;
}

export async function setPreference(key: string, value: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return; // belum login — tidak ada tempat menyimpan
  const { error } = await supabase.from('user_preferences').upsert(
    {
      user_id: userId,
      pref_key: key,
      pref_value: value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,pref_key' }
  );
  if (error) throw error;
}
