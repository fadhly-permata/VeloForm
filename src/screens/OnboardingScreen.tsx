import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAuthStore, type Business } from '../store/authStore';
import { useI18n } from '../i18n';

/** R-031: kelompokkan user berdasarkan nama usaha sebelum masuk aplikasi. */
export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const businesses = useAuthStore((s) => s.businesses);
  const error = useAuthStore((s) => s.error);
  const dbUnavailable = useAuthStore((s) => s.dbUnavailable);
  const loadBusinesses = useAuthStore((s) => s.loadBusinesses);
  const createBusiness = useAuthStore((s) => s.createBusiness);
  const joinBusiness = useAuthStore((s) => s.joinBusiness);
  const signOut = useAuthStore((s) => s.signOut);

  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await createBusiness(name);
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="business" size={26} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t('onboard.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('onboard.subtitle')}</Text>

          {dbUnavailable ? (
            <View style={[styles.notice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
              <Ionicons name="warning" size={18} color="#ffffff" />
              <Text style={styles.noticeText}>{t('onboard.dbUnavailable')}</Text>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('onboard.createNew')}</Text>
              <TextInput
                label={t('onboard.businessNameLabel')}
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={() => void handleCreate()}
                loading={creating}
                disabled={creating || !name.trim()}
                style={styles.createBtn}
              >
                {t('onboard.createAndAdmin')}
              </Button>

              <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 20 }]}>
                {t('onboard.orJoin')}
              </Text>
              {businesses.length === 0 ? (
                <Text style={[styles.empty, { color: colors.textMuted }]}>
                  {t('onboard.noBusinesses')}
                </Text>
              ) : (
                businesses.map((b: Business) => (
                  <Pressable
                    key={b.id}
                    onPress={() => void joinBusiness(b)}
                    style={[styles.businessRow, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
                  >
                    <Ionicons name="business-outline" size={18} color={colors.primary} />
                    <Text style={[styles.businessName, { color: colors.text }]}>{b.name}</Text>
                    <Text style={[styles.joinText, { color: colors.primary }]}>{t('onboard.join')}</Text>
                  </Pressable>
                ))
              )}
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  createBtn: {
    marginBottom: 4,
  },
  empty: {
    fontSize: 13,
    paddingVertical: 8,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  businessName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  joinText: {
    fontSize: 13,
    fontWeight: '700',
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
