import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme';
import { useSettingsStore, type ThemeMode } from '../../store/settingsStore';

const THEME_OPTIONS: { value: ThemeMode; label: string; hint: string }[] = [
  { value: 'light', label: 'Light', hint: 'Kontras tinggi untuk siang hari' },
  { value: 'dark', label: 'Dark', hint: 'Mode gelap hemat daya' },
  { value: 'auto', label: 'Auto', hint: 'Ikuti preferensi sistem' },
];

export default function ThemeSection() {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>Tema</Text>
      {THEME_OPTIONS.map((opt) => {
        const active = themeMode === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setThemeMode(opt.value)}
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>{opt.label}</Text>
              <Text style={[styles.hint, { color: colors.textMuted }]}>{opt.hint}</Text>
            </View>
            <View
              style={[
                styles.radio,
                { borderColor: active ? colors.primary : colors.border },
                { backgroundColor: active ? colors.primary : colors.surfaceAlt },
              ]}
            >
              {active ? <View style={[styles.radioDot, { backgroundColor: colors.onPrimary }]} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
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
