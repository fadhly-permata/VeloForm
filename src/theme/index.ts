import { useMemo } from 'react';
import { useColorScheme, type ColorSchemeName } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  type MD3Theme,
} from 'react-native-paper';
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { useSettingsStore, type ThemeMode } from '../store/settingsStore';

/**
 * Semantic color tokens per mode — single source of truth for the whole app.
 *
 * R-029: palet bergaya panel admin (AdminLTE): sidebar gelap, primary biru,
 * body abu terang, kartu putih dengan border tipis.
 */
export interface Palette {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  /** Admin sidebar (AdminLTE) */
  sidebar: string;
  sidebarText: string;
  sidebarMuted: string;
  sidebarActiveBg: string;
  sidebarAccent: string;
}

export const palette: Record<'light' | 'dark', Palette> = {
  light: {
    primary: '#2563eb',
    onPrimary: '#ffffff',
    primaryContainer: '#dbeafe',
    onPrimaryContainer: '#1e3a8a',
    secondary: '#475569',
    accent: '#f59e0b',
    background: '#f1f5f9',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    error: '#dc2626',
    success: '#16a34a',
    sidebar: '#343a40',
    sidebarText: '#c2c7d0',
    sidebarMuted: '#8f969e',
    sidebarActiveBg: '#3f474e',
    sidebarAccent: '#007bff',
  },
  dark: {
    primary: '#60a5fa',
    onPrimary: '#0f172a',
    primaryContainer: '#1e3a8a',
    onPrimaryContainer: '#dbeafe',
    secondary: '#94a3b8',
    accent: '#fbbf24',
    background: '#2f353b',
    surface: '#3a4047',
    surfaceAlt: '#454b52',
    text: '#e2e8f0',
    textMuted: '#a6aeb7',
    border: '#4a5158',
    error: '#f87171',
    success: '#4ade80',
    sidebar: '#24292f',
    sidebarText: '#c2c7d0',
    sidebarMuted: '#868e96',
    sidebarActiveBg: '#2f363d',
    sidebarAccent: '#60a5fa',
  },
};

function buildPaperTheme(isDark: boolean): MD3Theme {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const c = palette[isDark ? 'dark' : 'light'];
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.onPrimary,
      primaryContainer: c.primaryContainer,
      onPrimaryContainer: c.onPrimaryContainer,
      secondary: c.secondary,
      background: c.background,
      surface: c.surface,
      surfaceVariant: c.surfaceAlt,
      onSurface: c.text,
      onSurfaceVariant: c.textMuted,
      outline: c.border,
      error: c.error,
    },
  };
}

const adaptedNav = adaptNavigationTheme({
  reactNavigationLight: NavLightTheme,
  reactNavigationDark: NavDarkTheme,
});

function buildNavTheme(isDark: boolean): NavTheme {
  const base = isDark ? adaptedNav.DarkTheme : adaptedNav.LightTheme;
  const c = palette[isDark ? 'dark' : 'light'];
  return {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.accent,
    },
  };
}

function resolveMode(themeMode: ThemeMode, systemScheme: ColorSchemeName): 'light' | 'dark' {
  if (themeMode === 'auto') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return themeMode;
}

export interface AppTheme {
  isDark: boolean;
  mode: 'light' | 'dark';
  colors: Palette;
  paperTheme: MD3Theme;
  navTheme: NavTheme;
}

/**
 * Resolves the active theme from the settings store (light/dark/auto) plus the
 * system color scheme, and returns semantic tokens + ready-made themes for
 * React Native Paper and React Navigation.
 */
export function useAppTheme(): AppTheme {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  return useMemo(() => {
    const mode = resolveMode(themeMode, systemScheme);
    const isDark = mode === 'dark';
    return {
      isDark,
      mode,
      colors: palette[mode],
      paperTheme: buildPaperTheme(isDark),
      navTheme: buildNavTheme(isDark),
    };
  }, [themeMode, systemScheme]);
}
