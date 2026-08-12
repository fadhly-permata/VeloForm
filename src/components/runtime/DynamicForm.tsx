import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../theme';
import { useI18n, type TranslationKey } from '../../i18n';
import type { GeneratedSchema, SchemaField } from '../../services/schema';
import {
  initialValues,
  isFieldVisible,
  validateForm,
  type FormValues,
} from '../../services/runtime';

const TYPE_KEYS: Record<string, TranslationKey> = {
  text: 'studio.typeText',
  number: 'studio.typeNumber',
  textarea: 'studio.typeTextarea',
  select: 'studio.typeSelect',
  date: 'studio.typeDate',
  boolean: 'studio.typeBoolean',
  email: 'studio.typeEmail',
  currency: 'studio.typeCurrency',
};

interface DynamicFormProps {
  schema: GeneratedSchema;
  submitLabel?: string;
  submitting?: boolean;
  /** ON_SUBMIT callback — receives the validated values. */
  onSubmit: (values: FormValues) => void;
  /** ON_CHANGE callback — fires on every value change. */
  onChange?: (values: FormValues) => void;
}

/** R-020/R-021: renders any generated schema as an interactive, validated form. */
export default function DynamicForm({
  schema,
  submitLabel,
  submitting,
  onSubmit,
  onChange,
}: DynamicFormProps) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const [values, setValues] = useState<FormValues>(() => initialValues(schema));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (id: string, value: string | number | boolean) => {
    const next = { ...values, [id]: value };
    setValues(next);
    // ON_CHANGE: re-validate + let the parent react (e.g. workflow input changes).
    if (errors[id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    onChange?.(next);
  };

  const handleSubmit = () => {
    const result = validateForm(schema, values);
    setErrors(result.errors);
    if (result.ok) onSubmit(values);
  };

  const fields = schema.fields.filter((f) => isFieldVisible(f, values));

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{schema.name}</Text>
      {schema.description ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{schema.description}</Text>
      ) : null}

      {fields.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>{t('data.noFields')}</Text>
      ) : (
        fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={values[field.id]}
            error={!!errors[field.id]}
            onChange={(v) => update(field.id, v)}
            typeLabel={t(TYPE_KEYS[field.type] ?? 'studio.typeText')}
            colors={colors}
          />
        ))
      )}

      <View style={styles.actions}>
        <Button mode="contained" onPress={handleSubmit} loading={submitting} disabled={submitting}>
          {submitting ? t('data.submitting') : (submitLabel ?? t('data.submit'))}
        </Button>
      </View>
    </View>
  );
}

function FieldInput({
  field,
  value,
  error,
  onChange,
  typeLabel,
  colors,
}: {
  field: SchemaField;
  value: string | number | boolean | undefined;
  error: boolean;
  onChange: (value: string | number | boolean) => void;
  typeLabel: string;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  const { t } = useI18n();

  if (field.type === 'boolean') {
    return (
      <View style={styles.booleanRow}>
        <Checkbox
          status={value ? 'checked' : 'unchecked'}
          onPress={() => onChange(!value)}
          color={colors.primary}
        />
        <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
        {field.required ? <RequiredBadge /> : null}
      </View>
    );
  }

  if (field.type === 'select') {
    const options = field.options ?? [];
    return (
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
        <View style={styles.optionRow}>
          {options.map((opt, i) => {
            const active = String(value) === opt;
            return (
              <Pressable
                key={`${i}`}
                onPress={() => onChange(opt)}
                style={[
                  styles.optionChip,
                  { borderColor: active ? colors.primary : colors.border },
                  { backgroundColor: active ? colors.primaryContainer : colors.surfaceAlt },
                ]}
              >
                <Text
                  style={[styles.optionText, { color: active ? colors.onPrimaryContainer : colors.text }]}
                >
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {error ? <ErrorText /> : null}
      </View>
    );
  }

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
      <TextInput
        mode="outlined"
        value={value === undefined || typeof value === 'boolean' ? '' : String(value)}
        onChangeText={(text) =>
          onChange(field.type === 'number' ? (text === '' ? '' : Number(text)) : text)
        }
        placeholder={field.placeholder ?? typeLabel}
        error={error}
        multiline={field.type === 'textarea'}
        keyboardType={
          field.type === 'number'
            ? 'numeric'
            : field.type === 'email'
              ? 'email-address'
              : undefined
        }
        style={styles.input}
      />
      {error ? <ErrorText /> : null}
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

function ErrorText() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  return (
    <View style={styles.errorRow}>
      <Ionicons name="alert-circle" size={13} color={colors.error} />
      <Text style={[styles.errorText, { color: colors.error }]}>{t('runtime.required')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  empty: {
    fontSize: 13,
    paddingVertical: 10,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'transparent',
  },
  booleanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
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
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
