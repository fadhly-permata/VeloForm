import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAiStore } from '../store/aiStore';
import { useUiStore } from '../store/uiStore';
import { useI18n } from '../i18n';

/**
 * Shown on AI-dependent screens until at least one AI provider is configured
 * and active. Links straight to the Settings section of the admin shell.
 */
export default function AiProviderWarning() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const providers = useAiStore((s) => s.providers);
  const loaded = useAiStore((s) => s.loaded);
  const setSection = useUiStore((s) => s.setSection);

  if (!loaded) return null;
  if (providers.some((p) => p.isActive)) return null;

  return (
    <Pressable
      onPress={() => setSection('settings')}
      style={[styles.banner, { backgroundColor: colors.accent, borderColor: colors.border }]}
    >
      <Ionicons name="warning" size={18} color={colors.onPrimary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.onPrimary }]}>{t('ai.warningTitle')}</Text>
        <Text style={[styles.subtitle, { color: colors.onPrimary }]}>{t('ai.warningBody')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },
});
