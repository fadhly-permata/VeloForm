import type { GeneratedSchema, SchemaField } from './schema';

/**
 * Dynamic form runtime (Fase 4 — WP-15/WP-16).
 * Pure helpers used by DynamicForm: initial values, conditional visibility
 * (ON_CHANGE), and required validation (ON_SUBMIT).
 */

export type FormValues = Record<string, string | number | boolean>;

export function initialValues(schema: GeneratedSchema): FormValues {
  const values: FormValues = {};
  for (const field of schema.fields) {
    if (field.defaultValue !== undefined) {
      values[field.id] = field.defaultValue;
    } else if (field.type === 'boolean') {
      values[field.id] = false;
    } else {
      values[field.id] = '';
    }
  }
  return values;
}

/** Apply `visibleWhen` conditions — a field is hidden while its condition is unmet. */
export function isFieldVisible(field: SchemaField, values: FormValues): boolean {
  const cond = field.visibleWhen;
  if (!cond || !cond.field) return true;
  return String(values[cond.field] ?? '') === cond.equals;
}

export function visibleFields(schema: GeneratedSchema, values: FormValues): SchemaField[] {
  return schema.fields.filter((f) => isFieldVisible(f, values));
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

/** Required-field validation for the currently visible fields. */
export function validateForm(schema: GeneratedSchema, values: FormValues): ValidationResult {
  const errors: Record<string, string> = {};
  for (const field of schema.fields) {
    if (!isFieldVisible(field, values)) continue;
    const value = values[field.id];
    const empty = value === undefined || value === null || String(value).trim() === '';
    if (field.required && empty) {
      errors[field.id] = field.label;
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
