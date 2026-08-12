import { create } from 'zustand';
import {
  generateSchema,
  refineSchema,
  type AiProviderConfig,
  type GeneratedSchema,
  type SchemaErrorCode,
  type SchemaKind,
} from '../services/schema';
import { useAiStore } from './aiStore';
import { useAuthStore } from './authStore';
import { getSecret, secretKeyFor } from '../storage/secureStorage';
import { supabase } from '../lib/supabase';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Assistant entries may carry the schema snapshot they produced. */
  schema: GeneratedSchema | null;
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Resolve the active provider + its API key from secure storage. */
async function resolveProvider(): Promise<{ provider: AiProviderConfig; apiKey: string } | null> {
  const active = useAiStore.getState().providers.find((p) => p.isActive);
  if (!active) return null;
  const apiKey = await getSecret(secretKeyFor(active.id));
  if (!apiKey) return null;
  return {
    provider: { id: active.id, baseUrl: active.baseUrl, model: active.model },
    apiKey,
  };
}

interface StudioState {
  kind: SchemaKind;
  prompt: string;
  chat: string;
  schema: GeneratedSchema | null;
  history: ChatEntry[];
  generating: boolean;
  refining: boolean;
  saving: boolean;
  /** i18n error code — the UI maps it to a translated message. */
  errorCode: SchemaErrorCode | null;
  errorStatus?: number;
  errorMessage?: string;
  saveState: SaveState;
  setKind: (kind: SchemaKind) => void;
  setPrompt: (prompt: string) => void;
  setChat: (chat: string) => void;
  generate: () => Promise<void>;
  refine: () => Promise<void>;
  saveSchema: () => Promise<void>;
  reset: () => void;
}

export const useStudioStore = create<StudioState>()((set, get) => ({
  kind: 'master',
  prompt: '',
  chat: '',
  schema: null,
  history: [],
  generating: false,
  refining: false,
  saving: false,
  errorCode: null,
  saveState: 'idle',

  setKind: (kind) => set({ kind }),
  setPrompt: (prompt) => set({ prompt }),
  setChat: (chat) => set({ chat }),

  generate: async () => {
    const { kind, prompt } = get();
    if (!prompt.trim() || get().generating) return;
    const resolved = await resolveProvider();
    if (!resolved) {
      set({ errorCode: 'no_provider', errorMessage: undefined });
      return;
    }
    set({ generating: true, errorCode: null, errorMessage: undefined, saveState: 'idle' });
    const result = await generateSchema(kind, prompt.trim(), resolved.provider, resolved.apiKey);
    if (!result.ok) {
      set({
        generating: false,
        errorCode: result.code,
        errorStatus: result.status,
        errorMessage: result.message,
      });
      return;
    }
    set({
      generating: false,
      schema: result.schema,
      history: [
        { id: newId(), role: 'user', content: prompt.trim(), schema: null },
        { id: newId(), role: 'assistant', content: '', schema: result.schema },
      ],
      saveState: 'idle',
    });
  },

  refine: async () => {
    const { schema, chat, history } = get();
    if (!schema || !chat.trim() || get().refining) return;
    const resolved = await resolveProvider();
    if (!resolved) {
      set({ errorCode: 'no_provider', errorMessage: undefined });
      return;
    }
    const instruction = chat.trim();
    set({ refining: true, errorCode: null, errorMessage: undefined, saveState: 'idle' });
    const result = await refineSchema(schema, instruction, resolved.provider, resolved.apiKey);
    if (!result.ok) {
      set({
        refining: false,
        errorCode: result.code,
        errorStatus: result.status,
        errorMessage: result.message,
      });
      return;
    }
    set({
      refining: false,
      schema: result.schema,
      chat: '',
      history: [
        ...history,
        { id: newId(), role: 'user', content: instruction, schema: null },
        { id: newId(), role: 'assistant', content: '', schema: result.schema },
      ],
      saveState: 'idle',
    });
  },

  saveSchema: async () => {
    const { schema, saving } = get();
    if (!schema || saving) return;
    const businessId = useAuthStore.getState().profile?.business_id;
    set({ saving: true, saveState: 'idle' });
    try {
      if (schema.kind === 'workflow') {
        const { error } = await supabase
          .schema('bussiness')
          .from('workflows')
          .insert({ business_id: businessId, name: schema.name, definition: schema });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .schema('bussiness')
          .from('form_masters')
          .insert({
            business_id: businessId,
            name: schema.name,
            kind: schema.kind,
            schema_json: schema,
          });
        if (error) throw error;
      }
      set({ saving: false, saveState: 'saved' });
    } catch {
      // Migrasi Supabase belum jalan / jaringan — ditampilkan sebagai notice.
      set({ saving: false, saveState: 'error' });
    }
  },

  reset: () =>
    set({
      schema: null,
      history: [],
      chat: '',
      errorCode: null,
      errorMessage: undefined,
      saveState: 'idle',
    }),
}));
