import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useI18n } from '../i18n';

/** R-037: user baru (belum onboarded) melengkapi data diri setelah login Google. */
export default function RegistrationScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const session = useAuthStore((s) => s.session);
  const error = useAuthStore((s) => s.error);
  const dbUnavailable = useAuthStore((s) => s.dbUnavailable);
  const completeProfile = useAuthStore((s) => s.completeProfile);
  const signOut = useAuthStore((s) => s.signOut);

  // Autofill dari Google (R-037): nama, email, dan avatar diambil dari akun Google.
  const google = useMemo(() => {
    const user = session?.user;
    const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
    return {
      name:
        typeof metadata.full_name === 'string' && metadata.full_name
          ? metadata.full_name
          : typeof metadata.name === 'string'
            ? metadata.name
            : '',
      email: user?.email ?? (typeof metadata.email === 'string' ? metadata.email : ''),
      avatar:
        typeof metadata.picture === 'string' && metadata.picture
          ? metadata.picture
          : typeof metadata.avatar_url === 'string'
            ? metadata.avatar_url
            : '',
    };
  }, [session]);

  const [fullName, setFullName] = useState(google.name);
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const initials = useMemo(() => {
    const parts = (fullName || google.name || '?').trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || '?';
  }, [fullName, google.name]);

  const handleSubmit = async () => {
    if (!fullName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await completeProfile({ full_name: fullName, phone, position });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="person-add" size={26} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t('reg.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('reg.subtitle')}</Text>

          {dbUnavailable ? (
            <View style={[styles.notice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
              <Ionicons name="warning" size={18} color="#ffffff" />
              <Text style={styles.noticeText}>{t('onboard.dbUnavailable')}</Text>
            </View>
          ) : (
            <>
              {/* Avatar Google + field autofill */}
              <View style={styles.avatarRow}>
                {google.avatar ? (
                  <Image source={{ uri: google.avatar }} style={[styles.avatar, { borderColor: colors.border }]} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.primaryContainer, borderColor: colors.border }]}>
                    <Text style={[styles.avatarInitials, { color: colors.onPrimaryContainer }]}>{initials}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.autofillLabel, { color: colors.primary }]}>
                    <Ionicons name="logo-google" size={13} color={colors.primary} /> {t('reg.fromGoogle')}
                  </Text>
                  <Text style={[styles.autofillName, { color: colors.text }]} numberOfLines={1}>
                    {google.name || google.email}
                  </Text>
                </View>
              </View>

              <TextInput
                label={t('reg.fullName')}
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label={t('reg.email')}
                value={google.email}
                editable={false}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="mail-outline" />}
              />
              <TextInput
                label={t('reg.phone')}
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="call-outline" />}
              />
              <TextInput
                label={t('reg.position')}
                value={position}
                onChangeText={setPosition}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="briefcase-outline" />}
              />

              <Button
                mode="contained"
                onPress={() => void handleSubmit()}
                loading={submitting}
                disabled={submitting || !fullName.trim()}
                style={styles.submitBtn}
              >
                {t('reg.submit')}
              </Button>
            </>
          )}

          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

          <Pressable onPress={() => void signOut()} hitSlop={8} style={styles.signOut}>
            <Ionicons name="log-out-outline" size={15} color={colors.textMuted} />
            <Text style={[styles.signOutText, { color: colors.textMuted }]}>{t('onboard.switchAccount')}</Text>
          </Pressable>
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
    maxWidth: 460,
    borderRadius: 12,
    borderWidth: 1,
    padding: 28,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '800',
  },
  autofillLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  autofillName: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  input: {
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 4,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  noticeText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 17,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 12,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    alignSelf: 'center',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
