import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useI18n } from '../i18n';
import {
  deleteFormSchema,
  deleteTransaction,
  insertTransaction,
  listFormSchemas,
  listTransactions,
  type FormSchemaRecord,
  type TransactionRecord,
} from '../services/dataRepo';
import type { FormValues } from '../services/runtime';
import AiProviderWarning from '../components/AiProviderWarning';
import AdminCard from '../components/admin/AdminCard';
import SchemaPreview from '../components/studio/SchemaPreview';
import DynamicForm from '../components/runtime/DynamicForm';

type Selection =
  | { type: 'preview'; schema: FormSchemaRecord }
  | { type: 'fill'; schema: FormSchemaRecord }
  | { type: 'detail'; tx: TransactionRecord }
  | null;

/** Fase 5 (R-024/R-025): Master schemas, transactions CRUD, fill form, report summary. */
export default function ReportsScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();

  const [schemas, setSchemas] = useState<FormSchemaRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setDbError(false);
    try {
      const [schemasData, txData] = await Promise.all([listFormSchemas(), listTransactions()]);
      setSchemas(schemasData);
      setTransactions(txData);
    } catch {
      setSchemas([]);
      setTransactions([]);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleDeleteSchema = async (id: string) => {
    try {
      await deleteFormSchema(id);
      setSelection(null);
      await refresh();
    } catch {
      setDbError(true);
    }
  };

  const handleDeleteTx = async (id: string) => {
    try {
      await deleteTransaction(id);
      setSelection(null);
      await refresh();
    } catch {
      setDbError(true);
    }
  };

  const handleFillSubmit = async (values: FormValues) => {
    if (selection?.type !== 'fill') return;
    setSubmitting(true);
    setSubmitDone(false);
    try {
      await insertTransaction(selection.schema.id, values);
      setSubmitDone(true);
      await refresh();
    } catch {
      setDbError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const report = useMemo(() => {
    const byForm = new Map<string, number>();
    for (const tx of transactions) {
      byForm.set(tx.form_name, (byForm.get(tx.form_name) ?? 0) + 1);
    }
    return {
      totalTransactions: transactions.length,
      totalSchemas: schemas.length,
      byForm: [...byForm.entries()].sort((a, b) => b[1] - a[1]),
      latest: transactions.slice(0, 5),
    };
  }, [transactions, schemas]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <AiProviderWarning />

      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t('nav.reports')}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>{t('reports.subtitle')}</Text>
      </View>

      {dbError ? (
        <View style={[styles.notice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
          <Ionicons name="warning" size={16} color="#ffffff" />
          <Text style={styles.noticeText}>{t('data.dbNotReady')}</Text>
        </View>
      ) : null}

      <View style={styles.columns}>
        {/* Left — saved schemas (master) */}
        <View style={styles.col}>
          <AdminCard title={t('data.masterTitle')}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : schemas.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('data.masterEmpty')}</Text>
            ) : (
              schemas.map((schema) => (
                <View key={schema.id} style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: colors.text }]}>{schema.name}</Text>
                    <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
                      {schema.kind} · {new Date(schema.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Pressable onPress={() => setSelection({ type: 'preview', schema })} hitSlop={6} style={styles.iconBtn}>
                    <Ionicons name="eye-outline" size={18} color={colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => setSelection({ type: 'fill', schema })} hitSlop={6} style={styles.iconBtn}>
                    <Ionicons name="create-outline" size={18} color={colors.success} />
                  </Pressable>
                  <Pressable onPress={() => void handleDeleteSchema(schema.id)} hitSlop={6} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </Pressable>
                </View>
              ))
            )}
          </AdminCard>

          {/* Report summary */}
          <AdminCard title={t('data.reportTitle')}>
            <View style={styles.statRow}>
              <StatBox label={t('data.totalSchemas')} value={report.totalSchemas} color={colors.primary} />
              <StatBox label={t('data.totalTransactions')} value={report.totalTransactions} color={colors.success} />
            </View>
            {report.byForm.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('data.reportEmpty')}</Text>
            ) : (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('data.perForm')}</Text>
                {report.byForm.map(([name, count]) => (
                  <View key={name} style={styles.reportRow}>
                    <Text style={[styles.reportName, { color: colors.text }]} numberOfLines={1}>{name}</Text>
                    <Text style={[styles.reportCount, { color: colors.primary }]}>{count}</Text>
                  </View>
                ))}
              </>
            )}
          </AdminCard>
        </View>

        {/* Right — transactions + detail/preview/fill */}
        <View style={styles.col}>
          <AdminCard title={t('data.transactionsTitle')}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : transactions.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('data.transactionsEmpty')}</Text>
            ) : (
              transactions.map((tx) => (
                <Pressable
                  key={tx.id}
                  onPress={() => setSelection({ type: 'detail', tx })}
                  style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: colors.text }]}>{tx.form_name}</Text>
                    <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
                      {new Date(tx.created_at).toLocaleString()} · {Object.keys(tx.data).length} field
                    </Text>
                  </View>
                  <Pressable onPress={() => void handleDeleteTx(tx.id)} hitSlop={6} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </Pressable>
                </Pressable>
              ))
            )}
          </AdminCard>

          {/* Selection panel */}
          {selection ? (
            <AdminCard
              title={
                selection.type === 'preview'
                  ? t('data.formPreview')
                  : selection.type === 'fill'
                    ? t('data.fillFormTitle')
                    : t('data.detailTitle')
              }
              actions={
                <Pressable onPress={() => setSelection(null)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </Pressable>
              }
            >
              {selection.type === 'preview' ? (
                <SchemaPreview schema={selection.schema.schema} />
              ) : selection.type === 'fill' ? (
                <>
                  <DynamicForm
                    key={selection.schema.id}
                    schema={selection.schema.schema}
                    submitting={submitting}
                    onSubmit={handleFillSubmit}
                  />
                  {submitDone ? (
                    <Text style={{ color: colors.success, fontSize: 13, marginTop: 8 }}>
                      ✓ {t('data.submitted')}
                    </Text>
                  ) : null}
                </>
              ) : (
                <View>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>{selection.tx.form_name}</Text>
                  <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
                    {new Date(selection.tx.created_at).toLocaleString()}
                  </Text>
                  <View style={[styles.jsonBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontSize: 12, lineHeight: 18 }}>
                      {JSON.stringify(selection.tx.data, null, 2)}
                    </Text>
                  </View>
                </View>
              )}
            </AdminCard>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.statBox, { borderColor: colors.border, borderLeftColor: color }]}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
  },
  pageHeader: { marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: '800' },
  pageSubtitle: { fontSize: 14, marginTop: 4 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  noticeText: { flex: 1, color: '#ffffff', fontSize: 12, lineHeight: 17 },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  col: {
    flex: 1,
    minWidth: 360,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  rowTitle: { fontSize: 14, fontWeight: '700' },
  rowMeta: { fontSize: 12, marginTop: 2 },
  iconBtn: { padding: 4 },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 12,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  reportName: { flex: 1, fontSize: 13 },
  reportCount: { fontSize: 14, fontWeight: '700' },
  jsonBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginTop: 10,
    maxHeight: 320,
  },
});
