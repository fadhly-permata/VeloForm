import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme';
import { LANGUAGE_OPTIONS, useI18n } from '../../i18n';

/** R-032: language picker — separate translation files per language (en, id). */
export default function LanguageSection() {
  const { colors } = useAppTheme();
  const { language, setLanguage, t } = useI18n();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{t('language.title')}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('language.subtitle')}</Text>
      {LANGUAGE_OPTIONS.map((opt) => {
        const active = language === opt.value;
        return (
          <Pressable key={opt.value} onPress={() => setLanguage(opt.value)} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>{t(opt.labelKey)}</Text>
              <Text style={[styles.hint, { color: colors.textMuted }]}>{t(opt.hintKey)}</Text>
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
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
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
