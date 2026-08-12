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

/** Semantic color tokens per mode. Single source of truth for the whole app. */
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
}

export const palette: Record<'light' | 'dark', Palette> = {
  light: {
    primary: '#0d9488',
    onPrimary: '#ffffff',
    primaryContainer: '#ccfbf1',
    onPrimaryContainer: '#0a3d38',
    secondary: '#2563eb',
    accent: '#d97706',
    background: '#f4f6f7',
    surface: '#ffffff',
    surfaceAlt: '#e9edef',
    text: '#17211f',
    textMuted: '#5b6a66',
    border: '#d7dedb',
    error: '#dc2626',
    success: '#16a34a',
  },
  dark: {
    primary: '#2dd4bf',
    onPrimary: '#04302c',
    primaryContainer: '#11504a',
    onPrimaryContainer: '#b7f4e9',
    secondary: '#93c5fd',
    accent: '#fbbf24',
    background: '#0a0f12',
    surface: '#11181c',
    surfaceAlt: '#1a2429',
    text: '#e6ecee',
    textMuted: '#8ba0a0',
    border: '#253238',
    error: '#f87171',
    success: '#4ade80',
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
