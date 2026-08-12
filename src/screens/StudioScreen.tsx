import { StyleSheet, Text, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import AiProviderWarning from '../components/AiProviderWarning';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useI18n } from '../i18n';

export default function StudioScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const role = useAuthStore((s) => s.profile?.role);
  const isAdmin = role === 'admin';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AiProviderWarning />
      <ScreenPlaceholder
        icon="flash"
        title={t('studio.title')}
        description={t('studio.description')}
      >
        {!isAdmin ? (
          <Text style={[styles.roleNote, { color: colors.textMuted }]}>
            {t('studio.roleNote', { role: 'admin' })}
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
