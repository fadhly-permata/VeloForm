import { StyleSheet, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import AiProviderWarning from '../components/AiProviderWarning';
import { useAppTheme } from '../theme';

export default function WorkflowScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AiProviderWarning />
      <ScreenPlaceholder
        icon="git-network"
        title="Workflow Engine"
        description="Eksekusi logika bisnis otomatis: trigger form, cron scheduler, task queue & decision nodes. Hadir di Fase 4."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
