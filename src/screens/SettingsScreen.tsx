import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import ThemeSection from '../components/settings/ThemeSection';
import AiProviderSection from '../components/settings/AiProviderSection';

export default function SettingsScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemeSection />
        <AiProviderSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});
