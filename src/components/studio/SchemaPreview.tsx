import { StyleSheet, Text, View } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../theme';
import { useI18n, type TranslationKey } from '../../i18n';
import type { FieldType, GeneratedSchema } from '../../services/schema';

const TYPE_KEYS: Record<FieldType, TranslationKey> = {
  text: 'studio.typeText',
  number: 'studio.typeNumber',
  textarea: 'studio.typeTextarea',
  select: 'studio.typeSelect',
  date: 'studio.typeDate',
  boolean: 'studio.typeBoolean',
  email: 'studio.typeEmail',
  currency: 'studio.typeCurrency',
};

/** R-019: render the generated schema as an editable-looking form preview
 *  following the active theme (Light/Dark/Auto) via semantic tokens. */
export default function SchemaPreview({ schema }: { schema: GeneratedSchema | null }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();

  if (!schema) {
    return (
      <View style={styles.empty}>
        <Ionicons name="eye-outline" size={34} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('studio.previewEmpty')}</Text>
      </View>
    );
  }

  const isWorkflow = schema.kind === 'workflow';

  return (
    <View>
      <Text style={[styles.name, { color: colors.text }]}>{schema.name}</Text>
      {schema.description ? (
        <Text style={[styles.description, { color: colors.textMuted }]}>{schema.description}</Text>
      ) : null}
      <View style={[styles.kindChip, { backgroundColor: colors.primaryContainer }]}>
        <Text style={[styles.kindChipText, { color: colors.onPrimaryContainer }]}>
          {t(schema.kind === 'master' ? 'studio.kindMaster' : schema.kind === 'transaction' ? 'studio.kindTransaction' : schema.kind === 'report' ? 'studio.kindReport' : 'studio.kindWorkflow')}
        </Text>
      </View>

      {isWorkflow && schema.trigger ? (
        <View style={[styles.flowBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.flowLabel, { color: colors.textMuted }]}>{t('studio.workflowTrigger')}</Text>
          <Text style={[styles.flowValue, { color: colors.text }]}>{schema.trigger}</Text>
          {(schema.actions ?? []).length > 0 ? (
            <>
              <Text style={[styles.flowLabel, { color: colors.textMuted, marginTop: 10 }]}>
                {t('studio.workflowActions')}
              </Text>
              {schema.actions?.map((action, i) => (
                <View key={`${i}`} style={styles.actionRow}>
                  <Ionicons name="arrow-forward-circle-outline" size={14} color={colors.primary} />
                  <Text style={[styles.flowValue, { color: colors.text }]}>{action}</Text>
                </View>
              ))}
            </>
          ) : null}
        </View>
      ) : null}

      <Text style={[styles.fieldsTitle, { color: colors.text }]}>{t('studio.fieldsTitle')}</Text>
      {schema.fields.length === 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('studio.previewEmpty')}</Text>
      ) : (
        schema.fields.map((field) => (
          <View key={field.id} style={styles.field}>
            {field.type === 'boolean' ? (
              <View style={styles.booleanRow}>
                <Checkbox status={field.defaultValue ? 'checked' : 'unchecked'} color={colors.primary} />
                <Text style={[styles.fieldLabel, { color: colors.text }]}>{field.label}</Text>
                {field.required ? <RequiredBadge /> : null}
              </View>
            ) : (
              <>
                <View style={styles.fieldHeader}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>{field.label}</Text>
                  {field.required ? <RequiredBadge /> : null}
                  <Text style={[styles.fieldType, { color: colors.textMuted }]}>{t(TYPE_KEYS[field.type])}</Text>
                </View>
                {field.type === 'select' ? (
                  <View style={styles.optionRow}>
                    {(field.options ?? []).map((opt, i) => (
                      <View
                        key={`${i}`}
                        style={[styles.optionChip, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
                      >
                        <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <TextInput
                    mode="outlined"
                    placeholder={field.placeholder ?? field.label}
                    disabled
                    multiline={field.type === 'textarea'}
                    keyboardType={field.type === 'number' ? 'numeric' : field.type === 'email' ? 'email-address' : undefined}
                    style={styles.input}
                  />
                )}
              </>
            )}
          </View>
        ))
      )}
    </View>
  );
}

function RequiredBadge() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  return (
    <View style={[styles.reqBadge, { backgroundColor: colors.error }]}>
      <Text style={styles.reqBadgeText}>{t('studio.fieldRequired')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 19,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  kindChip: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
    marginBottom: 6,
  },
  kindChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  flowBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginTop: 8,
  },
  flowLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  flowValue: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
  },
  fieldsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  booleanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  fieldType: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  reqBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reqBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  input: {
    backgroundColor: 'transparent',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
