import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useI18n } from '../i18n';
import { useWorkflowStore } from '../store/workflowStore';
import { listTasks, processDueTasks, type QueuedTask } from '../services/queue';
import AiProviderWarning from '../components/AiProviderWarning';
import AdminCard from '../components/admin/AdminCard';
import DynamicForm from '../components/runtime/DynamicForm';

/** Fase 4 (R-020..R-023): workflow runner + execution log + local task queue. */
export default function WorkflowScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const workflows = useWorkflowStore((s) => s.workflows);
  const loaded = useWorkflowStore((s) => s.loaded);
  const dbError = useWorkflowStore((s) => s.dbError);
  const selectedId = useWorkflowStore((s) => s.selectedId);
  const running = useWorkflowStore((s) => s.running);
  const runLog = useWorkflowStore((s) => s.runLog);
  const load = useWorkflowStore((s) => s.load);
  const select = useWorkflowStore((s) => s.select);
  const run = useWorkflowStore((s) => s.run);

  const [tasks, setTasks] = useState<QueuedTask[]>([]);
  const [processing, setProcessing] = useState(false);

  const selected = workflows.find((w) => w.id === selectedId) ?? null;

  const refreshTasks = async () => {
    try {
      setTasks(await listTasks(20));
    } catch {
      setTasks([]);
    }
  };

  useEffect(() => {
    void load();
    void refreshTasks();
  }, [load]);

  const handleProcessNow = async () => {
    setProcessing(true);
    try {
      await processDueTasks();
      await refreshTasks();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <AiProviderWarning />

      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t('nav.workflow')}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>{t('workflow.subtitle')}</Text>
      </View>

      {dbError ? (
        <View style={[styles.notice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
          <Ionicons name="warning" size={16} color="#ffffff" />
          <Text style={styles.noticeText}>{t('data.dbNotReady')}</Text>
        </View>
      ) : null}

      <View style={styles.columns}>
        {/* Left — saved workflows */}
        <View style={styles.col}>
          <AdminCard title={t('workflow.savedTitle')}>
            {!loaded ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : workflows.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="git-network-outline" size={30} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('workflow.empty')}</Text>
                <Text style={[styles.emptyHint, { color: colors.textMuted }]}>{t('workflow.emptyHint')}</Text>
              </View>
            ) : (
              workflows.map((workflow) => {
                const active = workflow.id === selectedId;
                return (
                  <Pressable
                    key={workflow.id}
                    onPress={() => select(workflow.id)}
                    style={[
                      styles.workflowRow,
                      { borderColor: active ? colors.primary : colors.border },
                      { backgroundColor: active ? colors.primaryContainer : colors.surfaceAlt },
                    ]}
                  >
                    <Ionicons name="git-network" size={18} color={active ? colors.primary : colors.textMuted} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.workflowName, { color: colors.text }]}>{workflow.name}</Text>
                      {workflow.definition.trigger ? (
                        <Text style={[styles.workflowTrigger, { color: colors.textMuted }]} numberOfLines={1}>
                          {workflow.definition.trigger}
                        </Text>
                      ) : null}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  </Pressable>
                );
              })
            )}
          </AdminCard>

          <AdminCard title={t('workflow.taskQueue')}>
            {tasks.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('workflow.queueEmpty')}</Text>
            ) : (
              tasks.map((task) => (
                <View key={task.id} style={[styles.taskRow, { borderColor: colors.border }]}>
                  <Ionicons
                    name={task.status === 'done' ? 'checkmark-circle' : task.status === 'error' ? 'alert-circle' : 'time'}
                    size={16}
                    color={task.status === 'done' ? colors.success : task.status === 'error' ? colors.error : colors.accent}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskName, { color: colors.text }]}>{task.name}</Text>
                    <Text style={[styles.taskMeta, { color: colors.textMuted }]}>
                      {new Date(task.runAt).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={[styles.taskStatus, { color: colors.textMuted }]}>{task.status}</Text>
                </View>
              ))
            )}
            <View style={styles.queueActions}>
              <View style={{ flex: 1 }} />
              <Button mode="outlined" compact onPress={handleProcessNow} loading={processing} disabled={processing} textColor={colors.primary}>
                {t('workflow.processNow')}
              </Button>
            </View>
          </AdminCard>
        </View>

        {/* Right — runner + execution log */}
        <View style={styles.col}>
          <AdminCard title={t('workflow.runnerTitle')}>
            {!selected ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('workflow.noSelection')}</Text>
            ) : (
              <DynamicForm
                key={selected.id}
                schema={selected.definition}
                submitLabel={running ? t('workflow.running') : t('workflow.run')}
                submitting={running}
                onSubmit={(values) => void run(values)}
              />
            )}
          </AdminCard>

          <AdminCard title={t('workflow.executionLog')}>
            {!runLog ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('workflow.noLog')}</Text>
            ) : runLog.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{t('workflow.noSteps')}</Text>
            ) : (
              runLog.map((entry) => (
                <View
                  key={entry.id}
                  style={[
                    styles.logRow,
                    { borderColor: colors.border, paddingLeft: 10 + entry.depth * 16 },
                  ]}
                >
                  <Ionicons
                    name={entry.detail === 'true' ? 'git-branch' : 'arrow-forward-circle-outline'}
                    size={14}
                    color={entry.detail === 'true' ? colors.success : colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.logLabel, { color: colors.text }]}>{entry.label}</Text>
                    {entry.detail && entry.detail !== 'true' && entry.detail !== 'false' ? (
                      <Text style={[styles.logDetail, { color: colors.textMuted }]}>{entry.detail}</Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </AdminCard>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
  },
  pageHeader: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  noticeText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 17,
  },
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
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  workflowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  workflowName: {
    fontSize: 14,
    fontWeight: '700',
  },
  workflowTrigger: {
    fontSize: 12,
    marginTop: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  taskName: {
    fontSize: 13,
    fontWeight: '600',
  },
  taskMeta: {
    fontSize: 11,
    marginTop: 1,
  },
  taskStatus: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  queueActions: {
    flexDirection: 'row',
    marginTop: 6,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    paddingVertical: 6,
    paddingRight: 8,
  },
  logLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  logDetail: {
    fontSize: 12,
    marginTop: 1,
    lineHeight: 17,
  },
});
