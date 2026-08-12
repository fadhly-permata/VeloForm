import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import ThemeSection from '../components/settings/ThemeSection';
import AiProviderSection from '../components/settings/AiProviderSection';
import AdminCard from '../components/admin/AdminCard';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const role = useAuthStore((s) => s.profile?.role);

  const isAdmin = role === 'admin';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemeSection />
        {isAdmin ? (
          <AiProviderSection />
        ) : (
          <AdminCard title="AI Provider — Akses dibatasi">
            <View style={styles.restricted}>
              <Ionicons name="lock-closed" size={20} color={colors.accent} />
              <Text style={[styles.restrictedText, { color: colors.textMuted }]}>
                Hanya user dengan role <Text style={{ fontWeight: '700', color: colors.text }}>admin</Text>{' '}
                yang dapat mengubah konfigurasi AI provider (perintah modifikasi aplikasi via AI).
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
