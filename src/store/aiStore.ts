import { create } from 'zustand';
import {
  deleteAiProvider,
  getAiProviders,
  setActiveAiProvider,
  upsertAiProvider,
  type AiProviderRow,
} from '../services/aiRepo';
import { useAuthStore } from './authStore';
import {
  deleteSecret,
  getSecret,
  saveSecret,
  secretKeyFor,
} from '../storage/secureStorage';
import { testProviderConnection, type TestResult } from '../services/ai';

export type AiProvider = AiProviderRow;

export interface AiProviderInput {
  id?: string;
  type: string;
  name: string;
  baseUrl: string;
  model: string;
  isActive: boolean;
  /** New API key to store. Omit/empty when editing without changing the key. */
  apiKey?: string;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface AiState {
  providers: AiProvider[];
  loaded: boolean;
  loadProviders: () => Promise<void>;
  saveProvider: (input: AiProviderInput) => Promise<AiProvider>;
  deleteProvider: (id: string) => Promise<void>;
  setActive: (id: string) => Promise<void>;
  hasApiKey: (id: string) => Promise<boolean>;
  testConnection: (id: string) => Promise<TestResult>;
}

export const useAiStore = create<AiState>()((set, get) => ({
  providers: [],
  loaded: false,

  loadProviders: async () => {
    const userId = useAuthStore.getState().session?.user?.id;
    try {
      let providers = userId ? await getAiProviders() : [];

      // Dev/testing convenience: when an OpenRouter key is provided via the
      // EXPO_PUBLIC_OPENROUTER_API_KEY env var and no provider exists yet,
      // seed a ready-to-test provider so connectivity testing works out of
      // the box. The key is copied into secure storage like any other key.
      const envKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
      if (providers.length === 0 && envKey && envKey.trim().length > 0) {
        const seeded: AiProvider = {
          id: 'env-openrouter',
          type: 'openrouter',
          name: 'OpenRouter (Testing)',
          baseUrl: 'https://openrouter.ai/api/v1',
          model: '',
          isActive: true,
        };
        if (userId) await upsertAiProvider(seeded); // persist hanya saat login
        await saveSecret(secretKeyFor(seeded.id), envKey.trim()).catch(() => {});
        providers = userId ? await getAiProviders() : [seeded];
      }

      set({ providers, loaded: true });
    } catch (error) {
      // Supabase belum siap / belum login — fallback: seed provider dari env
      // langsung di memori supaya Studio tetap bisa dipakai.
      console.warn('Failed to load AI providers (fallback to env):', error);
      const envKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
      if (envKey && envKey.trim().length > 0) {
        const seeded: AiProvider = {
          id: 'env-openrouter',
          type: 'openrouter',
          name: 'OpenRouter (Testing)',
          baseUrl: 'https://openrouter.ai/api/v1',
          model: '',
          isActive: true,
        };
        await saveSecret(secretKeyFor(seeded.id), envKey.trim()).catch(() => {});
        set({ providers: [seeded], loaded: true });
        return;
      }
      set({ providers: [], loaded: true });
    }
  },

  saveProvider: async (input) => {
    const id = input.id ?? newId();
    const provider: AiProvider = {
      id,
      type: input.type,
      name: input.name.trim(),
      baseUrl: input.baseUrl.trim(),
      model: input.model.trim(),
      isActive: input.isActive,
    };

    await upsertAiProvider(provider);

    if (input.apiKey && input.apiKey.trim()) {
      await saveSecret(secretKeyFor(id), input.apiKey.trim());
    }

    if (input.isActive) {
      await setActiveAiProvider(id);
      provider.isActive = true;
    }

    const providers = await getAiProviders();
    set({ providers });
    return provider;
  },

  deleteProvider: async (id) => {
    await deleteAiProvider(id);
    await deleteSecret(secretKeyFor(id));
    const providers = await getAiProviders();
    set({ providers });
  },

  setActive: async (id) => {
    await setActiveAiProvider(id);
    const providers = await getAiProviders();
    set({ providers });
  },

  hasApiKey: async (id) => {
    const key = await getSecret(secretKeyFor(id));
    return key != null && key.length > 0;
  },

  testConnection: async (id) => {
    const provider = get().providers.find((p) => p.id === id);
    if (!provider) {
      return { ok: false, message: 'Provider tidak ditemukan' };
    }
    const apiKey = await getSecret(secretKeyFor(id));
    return testProviderConnection(provider.baseUrl, apiKey);
  },
}));
