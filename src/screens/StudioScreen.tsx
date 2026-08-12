import { StyleSheet, Text, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import AiProviderWarning from '../components/AiProviderWarning';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';

export default function StudioScreen() {
  const { colors } = useAppTheme();
  const role = useAuthStore((s) => s.profile?.role);
  const isAdmin = role === 'admin';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AiProviderWarning />
      <ScreenPlaceholder
        icon="flash"
        title="Generation Studio"
        description="Generate Master Pages, Transactions, Reports & Decision Workflows dari prompt teks. Hadir di Fase 3."
      >
        {!isAdmin ? (
          <Text style={[styles.roleNote, { color: colors.textMuted }]}>
            🔒 Hanya user dengan role <Text style={{ fontWeight: '700', color: colors.text }}>admin</Text> yang
            dapat menggunakan perintah modifikasi aplikasi via AI provider.
          </Text>
        ) : null}
      </ScreenPlaceholder>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roleNote: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 420,
  },
});
