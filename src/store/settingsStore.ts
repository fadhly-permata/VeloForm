import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface SettingsState {
  /** Active theme mode. Persistence to `user_preferences` lands with WP-06. */
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  themeMode: 'auto',
  setThemeMode: (themeMode) => set({ themeMode }),
}));
