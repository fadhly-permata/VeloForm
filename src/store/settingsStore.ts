import { create } from 'zustand';
import { getPreference, setPreference } from '../db/db';

export type ThemeMode = 'light' | 'dark' | 'auto';

/** Supported languages (R-032). Language files: src/i18n/{en,id}.ts */
export type LanguageCode = 'en' | 'id';

const THEME_KEY = 'theme_mode';
const LANGUAGE_KEY = 'language';

interface SettingsState {
  /** Active theme mode. Persisted to `user_preferences` (WP-06). */
  themeMode: ThemeMode;
  /** Active UI language. Persisted to `user_preferences` (R-032). */
  language: LanguageCode;
  /** True once the persisted values have been loaded from the DB. */
  ready: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (lang: LanguageCode) => void;
  loadThemeMode: () => Promise<void>;
  loadLanguage: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  themeMode: 'auto',
  language: 'id',
  ready: false,

  setThemeMode: (themeMode) => {
    set({ themeMode });
    setPreference(THEME_KEY, themeMode).catch((error) => {
      console.warn('Failed to persist theme mode:', error);
    });
  },

  setLanguage: (language) => {
    set({ language });
    setPreference(LANGUAGE_KEY, language).catch((error) => {
      console.warn('Failed to persist language:', error);
    });
  },

  loadThemeMode: async () => {
    try {
      const stored = await getPreference(THEME_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        set({ themeMode: stored });
      }
    } catch (error) {
      console.warn('Failed to load theme mode:', error);
    } finally {
      set({ ready: true });
    }
  },

  loadLanguage: async () => {
    try {
      const stored = await getPreference(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'id') {
        set({ language: stored });
      }
    } catch (error) {
      console.warn('Failed to load language:', error);
    }
  },
}));
