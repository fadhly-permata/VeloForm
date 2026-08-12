import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import { useAppTheme } from '../theme';
import { useSettingsStore, type ThemeMode } from '../store/settingsStore';

const THEME_OPTIONS: { value: ThemeMode; label: string; hint: string }[] = [
  { value: 'light', label: 'Light', hint: 'Kontras tinggi untuk siang hari' },
  { value: 'dark', label: 'Dark', hint: 'Mode gelap hemat daya' },
  { value: 'auto', label: 'Auto', hint: 'Ikuti preferensi sistem' },
];

function ThemeModeChip({
  value,
  label,
  hint,
  active,
  onPress,
}: {
  value: ThemeMode;
  label: string;
  hint: string;
  active: boolean;
  onPress: (mode: ThemeMode) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.chipRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.chipLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.chipHint, { color: colors.textMuted }]}>{hint}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} theme`}
        onPress={() => onPress(value)}
        hitSlop={8}
        style={[
          styles.radio,
          { borderColor: active ? colors.primary : colors.border },
          { backgroundColor: active ? colors.primary : colors.surfaceAlt },
        ]}
      >
        {active ? <View style={[styles.radioDot, { backgroundColor: colors.onPrimary }]} /> : null}
      </Pressable>
    </View>
  );
}

export default function SettingsScreen() {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const { colors } = useAppTheme();

  return (
    <ScreenPlaceholder
      icon="settings"
      title="Settings"
      description="Pengaturan aplikasi. Persistensi pilihan tema ke user_preferences menyusul di Fase 1."
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Tema</Text>
        {THEME_OPTIONS.map((opt) => (
          <ThemeModeChip
            key={opt.value}
            value={opt.value}
            label={opt.label}
            hint={opt.hint}
            active={themeMode === opt.value}
            onPress={setThemeMode}
          />
        ))}
      </View>
    </ScreenPlaceholder>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  chipHint: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
