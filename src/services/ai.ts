export interface ProviderTypeMeta {
  id: string;
  label: string;
  defaultBaseUrl: string;
}

/** Supported AI providers (PRD Module 2 — multi-provider engine). */
export const PROVIDER_TYPES: ProviderTypeMeta[] = [
  { id: 'openrouter', label: 'OpenRouter', defaultBaseUrl: 'https://openrouter.ai/api/v1' },
  { id: 'openai', label: 'OpenAI', defaultBaseUrl: 'https://api.openai.com/v1' },
  { id: 'huggingface', label: 'HuggingFace', defaultBaseUrl: 'https://api-inference.huggingface.co' },
  { id: 'ollama', label: 'Ollama (lokal)', defaultBaseUrl: 'http://localhost:11434/v1' },
  { id: 'litellm', label: 'LiteLLM (proxy)', defaultBaseUrl: 'http://localhost:4000/v1' },
];

export function providerMeta(type: string): ProviderTypeMeta {
  return PROVIDER_TYPES.find((t) => t.id === type) ?? PROVIDER_TYPES[0];
}

export interface TestResult {
  ok: boolean;
  message: string;
}

/**
 * Minimal connectivity check: hit the provider's OpenAI-compatible /models
 * endpoint with the API key. Reports CORS/network failures honestly — on web
 * some providers block browser requests (native apps usually succeed).
 */
export async function testProviderConnection(
  baseUrl: string,
  apiKey: string | null
): Promise<TestResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const url = `${baseUrl.replace(/\/+$/, '')}/models`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    const res = await fetch(url, { headers, signal: controller.signal });
    if (res.ok) {
      return { ok: true, message: `Terkoneksi (HTTP ${res.status})` };
    }
    return { ok: false, message: `Gagal (HTTP ${res.status})` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('Failed to fetch')) {
      return {
        ok: false,
        message: 'Tidak dapat terhubung (CORS/network). Di aplikasi native biasanya berhasil.',
      };
    }
    return { ok: false, message: `Gagal: ${message}` };
  } finally {
    clearTimeout(timer);
  }
}
