import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client (R-028/R-030).
 *
 * Env (isi lewat Keys/API keys di Freebuff, prefix EXPO_PUBLIC_):
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *
 * Default schema = `logic` (profil user, preferensi, AI provider, telemetri).
 * Data bisnis (Master/Transaction/Report) di schema `bussiness` — akses lewat
 * `.schema('bussiness')` per query. Kedua schema harus di-expose di dashboard
 * Supabase: Settings → API → Exposed schemas.
 */
export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: { schema: 'logic' },
});

/** Base URL untuk redirect OAuth (web). */
export function oauthRedirectTo(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}
