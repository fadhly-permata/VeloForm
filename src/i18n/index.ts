import { useCallback } from 'react';
import { en, type EnMessages, type Messages, type TranslationKey } from './en';
import { id } from './id';
import { useSettingsStore, type LanguageCode, type ThemeMode } from '../store/settingsStore';

/**
 * VeloForm i18n (R-032).
 *
 * - Language files live in this folder, one file per language (`en.ts`, `id.ts`).
 * - `en.ts` is the source of truth for the key set; every other file must cover
 *   the exact same keys (enforced by the `Messages` type + `tsc`).
 * - The active language is chosen in Settings (`LanguageSection`) and persisted
 *   to `user_preferences` (key `language`).
 */

export type { EnMessages, Messages, TranslationKey } from './en';

/** Language files registered in the app. */
export const translations: Record<LanguageCode, Messages> = { en, id };

/** Display names for each supported language (labels themselves are translated). */
export const LANGUAGE_OPTIONS: {
  value: LanguageCode;
  labelKey: TranslationKey;
  hintKey: TranslationKey;
}[] = [
  { value: 'en', labelKey: 'language.english', hintKey: 'language.englishHint' },
  { value: 'id', labelKey: 'language.indonesian', hintKey: 'language.indonesianHint' },
];

/** Theme mode labels routed through i18n (shared by the topbar & dashboard). */
export const THEME_LABEL_KEYS: Record<ThemeMode, TranslationKey> = {
  light: 'theme.light',
  dark: 'theme.dark',
  auto: 'theme.auto',
};

/**
 * Resolve a translation key for a language, with `{param}` interpolation.
 * Falls back to English, then to the raw key, if anything is missing.
 */
export function translate(
  language: LanguageCode,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const table = translations[language] ?? translations.en;
  let text: string = table[key] ?? translations.en[key] ?? String(key);
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** React hook — returns the active language and a `t()` translate function. */
export function useI18n() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => translate(language, key, params),
    [language]
  );
  return { language, setLanguage, t };
}
