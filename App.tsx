import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AdminShell from './src/components/admin/AdminShell';
import { useAppTheme } from './src/theme';
import { initDatabases } from './src/db/db';
import { useSettingsStore } from './src/store/settingsStore';
import { useAiStore } from './src/store/aiStore';

export default function App() {
  const { isDark, paperTheme } = useAppTheme();

  // Open + migrate the dual SQLite databases, then hydrate persisted state.
  // Non-blocking: a failure must never take down the UI shell.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initDatabases();
        if (cancelled) return;
        await useSettingsStore.getState().loadThemeMode();
        await useAiStore.getState().loadProviders();
      } catch (error) {
        console.warn('App init failed:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AdminShell />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
