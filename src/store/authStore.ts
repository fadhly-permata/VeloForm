import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, oauthRedirectTo } from '../lib/supabase';

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  position: string | null;
  /** R-037: true setelah user baru menyelesaikan form pendaftaran. */
  onboarded: boolean;
  role: UserRole;
  business_id: string | null;
  business_name: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
}

export type AuthStatus = 'loading' | 'ready';

interface AuthState {
  status: AuthStatus;
  configured: boolean;
  session: Session | null;
  profile: Profile | null;
  businesses: Business[];
  error: string | null;
  /** True when the Supabase DB (migration) is not reachable yet. */
  dbUnavailable: boolean;
  init: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  /** R-037: simpan data form pendaftaran user baru (autofill Google). */
  completeProfile: (input: { full_name: string; phone: string; position: string }) => Promise<void>;
  loadBusinesses: () => Promise<void>;
  createBusiness: (name: string) => Promise<void>;
  joinBusiness: (business: Business) => Promise<void>;
  clearError: () => void;
}

function defaultProfileRow(userId: string) {
  return {
    id: userId,
    role: 'operator' as UserRole,
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'loading',
  configured: isSupabaseConfigured,
  session: null,
  profile: null,
  businesses: [],
  error: null,
  dbUnavailable: false,

  init: async () => {
    if (!isSupabaseConfigured) {
      set({ status: 'ready', configured: false });
      return;
    }
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({ session, configured: true });
      if (session?.user) {
        await get().refreshProfile();
      }
    } catch (error) {
      console.warn('Auth init failed:', error);
    } finally {
      set({ status: 'ready' });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
      if (session?.user) {
        void get().refreshProfile();
      } else {
        set({ profile: null, dbUnavailable: false });
      }
    });
  },

  signInWithGoogle: async () => {
    set({ error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: oauthRedirectTo() },
    });
    if (error) set({ error: error.message });
  },

  signOut: async () => {
    set({ error: null });
    await supabase.auth.signOut();
    set({ session: null, profile: null, dbUnavailable: false });
  },

  refreshProfile: async () => {
    const user = get().session?.user;
    if (!user) {
      set({ profile: null });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, phone, position, onboarded, role, business_id, business_name, created_at')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        // Relation tidak ada → migrasi Supabase belum dijalankan.
        if (String(error.code) === '42P01') {
          set({ dbUnavailable: true, profile: null });
          return;
        }
        throw error;
      }

      if (!data) {
        // User baru: buat baris profil default (role operator).
        await supabase
          .from('profiles')
          .upsert(defaultProfileRow(user.id), { onConflict: 'id' });
        const { data: fresh, error: freshError } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, phone, position, onboarded, role, business_id, business_name, created_at')
          .eq('id', user.id)
          .maybeSingle();
        if (freshError) throw freshError;
        set({ profile: (fresh as Profile) ?? null, dbUnavailable: false });
        return;
      }

      set({ profile: data as Profile, dbUnavailable: false });
    } catch (error) {
      console.warn('refreshProfile failed:', error);
      set({ dbUnavailable: false });
    }
  },

  loadBusinesses: async () => {
    const { data, error } = await supabase
      .schema('business')
      .from('businesses')
      .select('id, name')
      .order('name');
    if (error) {
      console.warn('loadBusinesses failed:', error);
      return;
    }
    set({ businesses: (data ?? []) as Business[] });
  },

  createBusiness: async (name) => {
    const user = get().session?.user;
    if (!user) return;
    set({ error: null });
    const trimmed = name.trim();
    if (!trimmed) {
      set({ error: 'Nama usaha wajib diisi.' });
      return;
    }
    const { error } = await supabase
      .schema('business')
      .from('businesses')
      .insert({ name: trimmed, created_by: user.id });
    if (error) {
      set({ error: error.message });
      return;
    }
    // Trigger `business.set_creator_admin` di Supabase otomatis mempromosikan
    // pembuat jadi admin + mengisi business_id/business_name di profile.
    await get().refreshProfile();
  },

  completeProfile: async ({ full_name, phone, position }) => {
    const user = get().session?.user;
    if (!user) return;
    set({ error: null });
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const avatar =
      typeof metadata.picture === 'string'
        ? metadata.picture
        : typeof metadata.avatar_url === 'string'
          ? metadata.avatar_url
          : null;
    const trimmedName = full_name.trim();
    if (!trimmedName) {
      set({ error: 'Nama lengkap wajib diisi.' });
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .update({
        email: user.email ?? null,
        full_name: trimmedName,
        avatar_url: avatar,
        phone: phone.trim() || null,
        position: position.trim() || null,
        onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().refreshProfile();
  },

  joinBusiness: async (business) => {
    const user = get().session?.user;
    if (!user) return;
    set({ error: null });
    const { error } = await supabase
      .from('profiles')
      .update({ business_id: business.id, business_name: business.name, role: 'operator' })
      .eq('id', user.id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().refreshProfile();
  },

  clearError: () => set({ error: null }),
}));
