import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootTabs from './src/navigation/RootTabs';
import { useAppTheme } from './src/theme';
import { initDatabases } from './src/db/db';

export default function App() {
  const { isDark, paperTheme, navTheme } = useAppTheme();

  // Open + migrate the dual SQLite databases (system_metadata.db, app_data.db).
  // Non-blocking: a failure must never take down the UI shell.
  useEffect(() => {
    initDatabases().catch((error) => {
      console.warn('Database init failed:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootTabs />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
