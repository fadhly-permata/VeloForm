import { StyleSheet, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import AiProviderWarning from '../components/AiProviderWarning';
import { useAppTheme } from '../theme';

export default function ReportsScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AiProviderWarning />
      <ScreenPlaceholder
        icon="document-text"
        title="Reports & Data"
        description="Master, Transactions & laporan dari data operasional bisnis (app_data.db). Hadir di Fase 5."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
