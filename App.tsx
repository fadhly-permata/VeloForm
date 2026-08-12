import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AdminShell from './src/components/admin/AdminShell';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useAppTheme } from './src/theme';
import { initDatabases } from './src/db/db';
import { useSettingsStore } from './src/store/settingsStore';
import { useAiStore } from './src/store/aiStore';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const { isDark, paperTheme, colors } = useAppTheme();
  const authStatus = useAuthStore((s) => s.status);
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);

  // Init setiap subsistem secara independen — kegagalan satu (mis. SQLite web)
  // tidak boleh menghalangi yang lain (auth/tema/AI).
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      await initDatabases().catch(() => {});
      if (cancelled) return;
      await useSettingsStore.getState().loadThemeMode();
      await useSettingsStore.getState().loadLanguage();
      await useAiStore.getState().loadProviders();
      await useAuthStore.getState().init();
    };
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  let content: React.ReactNode;
  if (authStatus === 'loading') {
    content = (
      <View style={[styles.splash, { backgroundColor: colors.sidebar }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  } else if (!session) {
    content = <AuthScreen />;
  } else if (!profile?.business_id) {
    content = <OnboardingScreen />;
  } else {
    content = <AdminShell />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {content}
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
