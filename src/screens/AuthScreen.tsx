import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';

/** R-030: login Google saja (login email dihapus — user tidak punya domain/SMTP). */
export default function AuthScreen() {
  const { colors } = useAppTheme();
  const status = useAuthStore((s) => s.status);
  const configured = useAuthStore((s) => s.configured);
  const dbUnavailable = useAuthStore((s) => s.dbUnavailable);
  const error = useAuthStore((s) => s.error);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  const busy = status === 'loading';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.sidebar }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.brandBadge, { backgroundColor: colors.sidebarAccent }]}>
            <Ionicons name="speedometer" size={26} color="#ffffff" />
          </View>
          <Text style={[styles.brand, { color: colors.text }]}>VeloForm</Text>
          <Text style={[styles.title, { color: colors.text }]}>Masuk ke aplikasi</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Login menggunakan akun Google. (Login email tidak tersedia.)
          </Text>

          {!configured ? (
            <View style={[styles.notice, { backgroundColor: colors.error, borderColor: colors.border }]}>
              <Ionicons name="alert-circle" size={18} color="#ffffff" />
              <Text style={styles.noticeText}>
                Konfigurasi Supabase belum lengkap. Tambahkan EXPO_PUBLIC_SUPABASE_URL dan
                EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY di Keys/API keys.
              </Text>
            </View>
          ) : (
            <>
              {dbUnavailable ? (
                <View style={[styles.notice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
                  <Ionicons name="warning" size={18} color="#ffffff" />
                  <Text style={styles.noticeText}>
                    Database Supabase belum disiapkan. Jalankan migrasi di supabase/migrations
                    dan expose schema usage & business (Settings → API → Exposed schemas).
                  </Text>
                </View>
              ) : null}

              <Pressable
                onPress={() => void signInWithGoogle()}
                disabled={busy}
                style={({ pressed }) => [
                  styles.googleBtn,
                  { borderColor: colors.border, backgroundColor: pressed ? colors.surfaceAlt : '#ffffff' },
                ]}
              >
                {busy ? (
                  <ActivityIndicator size="small" color={colors.textMuted} />
                ) : (
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                )}
                <Text style={styles.googleBtnText}>Masuk dengan Google</Text>
              </Pressable>

              {error ? (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  Gagal login: {error} — pastikan provider Google aktif di dashboard Supabase
                  (Authentication → Providers → Google).
                </Text>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  brandBadge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 13,
  },
  googleBtnText: {
    color: '#1f1f1f',
    fontSize: 15,
    fontWeight: '600',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    width: '100%',
  },
  noticeText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 17,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
    textAlign: 'center',
  },
});
