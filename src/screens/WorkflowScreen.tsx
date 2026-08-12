import { StyleSheet, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import AiProviderWarning from '../components/AiProviderWarning';
import { useAppTheme } from '../theme';
import { useI18n } from '../i18n';

export default function WorkflowScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AiProviderWarning />
      <ScreenPlaceholder
        icon="git-network"
        title={t('workflow.title')}
        description={t('workflow.description')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
