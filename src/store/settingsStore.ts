import { create } from 'zustand';
import { getPreference, setPreference } from '../db/db';

export type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_KEY = 'theme_mode';

interface SettingsState {
  /** Active theme mode. Persisted to `user_preferences` (WP-06). */
  themeMode: ThemeMode;
  /** True once the persisted value has been loaded from the DB. */
  ready: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  loadThemeMode: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  themeMode: 'auto',
  ready: false,

  setThemeMode: (themeMode) => {
    set({ themeMode });
    setPreference(THEME_KEY, themeMode).catch((error) => {
      console.warn('Failed to persist theme mode:', error);
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
}));
