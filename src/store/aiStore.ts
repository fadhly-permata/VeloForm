import { create } from 'zustand';
import {
  deleteAiProvider,
  getAiProviders,
  setActiveAiProvider,
  upsertAiProvider,
  type AiProviderRow,
} from '../db/db';
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
    try {
      const providers = await getAiProviders();
      set({ providers, loaded: true });
    } catch (error) {
      console.warn('Failed to load AI providers:', error);
      set({ loaded: true });
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
