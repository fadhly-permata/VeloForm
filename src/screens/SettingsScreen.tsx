import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useI18n } from '../i18n';
import ThemeSection from '../components/settings/ThemeSection';
import LanguageSection from '../components/settings/LanguageSection';
import AiProviderSection from '../components/settings/AiProviderSection';
import AdminCard from '../components/admin/AdminCard';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const role = useAuthStore((s) => s.profile?.role);

  const isAdmin = role === 'admin';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemeSection />
        <LanguageSection />
        {isAdmin ? (
          <AiProviderSection />
        ) : (
          <AdminCard title={t('settings.aiRestrictedTitle')}>
            <View style={styles.restricted}>
              <Ionicons name="lock-closed" size={20} color={colors.accent} />
              <Text style={[styles.restrictedText, { color: colors.textMuted }]}>
                {t('settings.aiRestrictedText', { role: 'admin' })}
              </Text>
            </View>
          </AdminCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  restricted: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  restrictedText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});
