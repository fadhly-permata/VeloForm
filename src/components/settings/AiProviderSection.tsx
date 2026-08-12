import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../theme';
import { useAiStore, type AiProvider, type AiProviderInput } from '../../store/aiStore';
import { PROVIDER_TYPES, providerMeta } from '../../services/ai';
import type { TestResult } from '../../services/ai';
import { useI18n } from '../../i18n';

interface FormState {
  id?: string;
  type: string;
  name: string;
  baseUrl: string;
  model: string;
  isActive: boolean;
  apiKey: string;
}

const emptyForm = (type = PROVIDER_TYPES[0].id): FormState => ({
  type,
  name: '',
  baseUrl: '',
  model: '',
  isActive: false,
  apiKey: '',
});

function ProviderRow({
  provider,
  onEdit,
  onDelete,
  onActivate,
  onTest,
  testResult,
}: {
  provider: AiProvider;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onTest: () => void;
  testResult: TestResult | null;
}) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const meta = providerMeta(provider.type);

  return (
    <View style={[styles.providerCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <View style={styles.providerHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.providerName, { color: colors.text }]}>
            {provider.name} {provider.isActive ? '★' : ''}
          </Text>
          <Text style={[styles.providerMeta, { color: colors.textMuted }]}>
            {provider.model
              ? t('ai.providerMetaWithModel', { label: meta.label, baseUrl: provider.baseUrl, model: provider.model })
              : t('ai.providerMeta', { label: meta.label, baseUrl: provider.baseUrl })}
          </Text>
        </View>
        {provider.isActive ? (
          <View style={[styles.badge, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.badgeText, { color: colors.onPrimaryContainer }]}>{t('ai.active')}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.providerActions}>
        <Button mode="outlined" compact onPress={onTest} textColor={colors.text}>
          {t('ai.testConnection')}
        </Button>
        {!provider.isActive ? (
          <Button mode="text" compact onPress={onActivate} textColor={colors.primary}>
            {t('ai.activate')}
          </Button>
        ) : null}
        <View style={{ flex: 1 }} />
        <Pressable onPress={onEdit} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="create-outline" size={20} color={colors.textMuted} />
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Pressable>
      </View>

      {testResult ? (
        <Text style={{ color: testResult.ok ? colors.success : colors.error, fontSize: 13, marginTop: 8 }}>
          {testResult.message}
        </Text>
      ) : null}
    </View>
  );
}

export default function AiProviderSection() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const providers = useAiStore((s) => s.providers);
  const loaded = useAiStore((s) => s.loaded);
  const saveProvider = useAiStore((s) => s.saveProvider);
  const deleteProvider = useAiStore((s) => s.deleteProvider);
  const setActive = useAiStore((s) => s.setActive);
  const testConnection = useAiStore((s) => s.testConnection);

  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const openAdd = () => {
    setForm(emptyForm());
    setFormError(null);
  };

  const openEdit = (provider: AiProvider) => {
    setForm({
      id: provider.id,
      type: provider.type,
      name: provider.name,
      baseUrl: provider.baseUrl,
      model: provider.model,
      isActive: provider.isActive,
      apiKey: '',
    });
    setFormError(null);
  };

  const onTypeChange = (type: string) => {
    setForm((f) => {
      if (!f) return f;
      const meta = providerMeta(type);
      return {
        ...f,
        type,
        baseUrl: meta.defaultBaseUrl,
        name: f.name || meta.label,
      };
    });
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.baseUrl.trim()) {
      setFormError(t('ai.requiredFields'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const input: AiProviderInput = {
        id: form.id,
        type: form.type,
        name: form.name,
        baseUrl: form.baseUrl,
        model: form.model,
        isActive: form.isActive,
        apiKey: form.apiKey.trim() ? form.apiKey.trim() : undefined,
      };
      await saveProvider(input);
      setForm(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    void deleteProvider(id).catch((error) => console.warn('Delete failed:', error));
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const result = await testConnection(id);
      setTestResults((prev) => ({ ...prev, [id]: result }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>AI Provider</Text>
        <Pressable onPress={openAdd} hitSlop={8}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {!loaded ? (
        <Text style={{ color: colors.textMuted }}>{t('common.loading')}</Text>
      ) : providers.length === 0 ? (
        <Text style={{ color: colors.textMuted, marginTop: 4 }}>{t('ai.empty')}</Text>
      ) : (
        providers.map((p) => (
          <ProviderRow
            key={p.id}
            provider={p}
            onEdit={() => openEdit(p)}
            onDelete={() => handleDelete(p.id)}
            onActivate={() => void setActive(p.id)}
            onTest={() => void handleTest(p.id)}
            testResult={testingId === p.id ? { ok: false, message: t('ai.testing') } : (testResults[p.id] ?? null)}
          />
        ))
      )}

      {form ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={{ marginTop: 12 }}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {form.id ? t('ai.editProvider') : t('ai.addProvider')}
            </Text>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t('ai.providerType')}</Text>
            <View style={styles.typeRow}>
              {PROVIDER_TYPES.map((t) => {
                const active = form.type === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => onTypeChange(t.id)}
                    style={[
                      styles.typeChip,
                      { borderColor: active ? colors.primary : colors.border },
                      { backgroundColor: active ? colors.primaryContainer : colors.surfaceAlt },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        { color: active ? colors.onPrimaryContainer : colors.text },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              label={t('ai.name')}
              value={form.name}
              onChangeText={(name) => setForm((f) => (f ? { ...f, name } : f))}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label={t('ai.baseUrl')}
              value={form.baseUrl}
              onChangeText={(baseUrl) => setForm((f) => (f ? { ...f, baseUrl } : f))}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              label={t('ai.modelOptional')}
              value={form.model}
              onChangeText={(model) => setForm((f) => (f ? { ...f, model } : f))}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              label={form.id ? t('ai.apiKeyEdit') : t('ai.apiKey')}
              value={form.apiKey}
              onChangeText={(apiKey) => setForm((f) => (f ? { ...f, apiKey } : f))}
              mode="outlined"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <Pressable
              onPress={() => setForm((f) => (f ? { ...f, isActive: !f.isActive } : f))}
              style={styles.checkboxRow}
            >
              <Checkbox
                status={form.isActive ? 'checked' : 'unchecked'}
                onPress={() => setForm((f) => (f ? { ...f, isActive: !f.isActive } : f))}
                color={colors.primary}
              />
              <Text style={{ color: colors.text }}>{t('ai.makeActive')}</Text>
            </Pressable>

            {formError ? <Text style={{ color: colors.error, marginTop: 8 }}>{formError}</Text> : null}

            <View style={styles.formActions}>
              <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving}>
                {t('common.save')}
              </Button>
              <Button mode="text" onPress={() => setForm(null)} disabled={saving}>
                {t('common.cancel')}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  providerCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 10,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  providerMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  providerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconBtn: {
    padding: 6,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
});
