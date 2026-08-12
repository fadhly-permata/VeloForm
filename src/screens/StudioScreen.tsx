import { StyleSheet, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import AiProviderWarning from '../components/AiProviderWarning';
import { useAppTheme } from '../theme';

export default function StudioScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AiProviderWarning />
      <ScreenPlaceholder
        icon="flash"
        title="Generation Studio"
        description="Generate Master Pages, Transactions, Reports & Decision Workflows dari prompt teks. Hadir di Fase 3."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
