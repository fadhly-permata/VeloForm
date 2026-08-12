import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secrets (AI provider API keys) are kept out of SQLite.
 * - Native (Android/iOS): expo-secure-store — encrypted at rest (WP-09).
 * - Web: localStorage fallback for the dev preview (NOT hardware encrypted).
 *   Real web hardening (e.g. server-side proxying) is a follow-up decision.
 */

const KEY_PREFIX = 'vf_secret_';

export function secretKeyFor(id: string): string {
  return `${KEY_PREFIX}${id}`;
}

export async function saveSecret(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {
      // storage full / private mode — ignore for dev preview
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getSecret(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
