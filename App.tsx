import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

// Minimal VeloForm scaffold shell. The full product (AI generation studio,
// workflow engine, dual-SQLite stores) will replace this screen.
export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={styles.logo}>⚡ VeloForm</Text>
      <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
        AI-Driven Form Generator & Workflow Engine
      </Text>
      <Text style={[styles.subtitle, isDark ? styles.subDark : styles.subLight]}>
        Prompt → Master Pages, Transactions, Reports & Decision Workflows.
        Scaffolded with Expo SDK 57 — Web, Android & iOS.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  containerLight: {
    backgroundColor: '#f6f7fb',
  },
  containerDark: {
    backgroundColor: '#0d1117',
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  textLight: {
    color: '#171923',
  },
  textDark: {
    color: '#e6edf3',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 420,
  },
  subLight: {
    color: '#4a5568',
  },
  subDark: {
    color: '#8b949e',
  },
});
