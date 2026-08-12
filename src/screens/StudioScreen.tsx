import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useStudioStore } from '../store/studioStore';
import type { SchemaErrorCode, SchemaKind } from '../services/schema';
import { useI18n, type TranslationKey } from '../i18n';
import AiProviderWarning from '../components/AiProviderWarning';
import AdminCard from '../components/admin/AdminCard';
import SchemaPreview from '../components/studio/SchemaPreview';
import ChatPanel from '../components/studio/ChatPanel';

const KIND_OPTIONS: { value: SchemaKind; labelKey: TranslationKey; icon: 'grid' | 'swap-horizontal' | 'document-text' | 'git-network' }[] = [
  { value: 'master', labelKey: 'studio.kindMaster', icon: 'grid' },
  { value: 'transaction', labelKey: 'studio.kindTransaction', icon: 'swap-horizontal' },
  { value: 'report', labelKey: 'studio.kindReport', icon: 'document-text' },
  { value: 'workflow', labelKey: 'studio.kindWorkflow', icon: 'git-network' },
];

const ERROR_KEYS: Record<SchemaErrorCode, TranslationKey> = {
  no_provider: 'studio.errNoProvider',
  no_key: 'studio.errNoKey',
  http: 'studio.errHttp',
  network: 'studio.errNetwork',
  parse: 'studio.errParse',
  empty: 'studio.errEmpty',
  unknown: 'studio.errUnknown',
};

/** Fase 3 (R-016..R-019): dual-pane generation studio with AI chat refinement. */
export default function StudioScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const role = useAuthStore((s) => s.profile?.role);
  const isAdmin = role === 'admin';

  const kind = useStudioStore((s) => s.kind);
  const setKind = useStudioStore((s) => s.setKind);
  const prompt = useStudioStore((s) => s.prompt);
  const setPrompt = useStudioStore((s) => s.setPrompt);
  const generate = useStudioStore((s) => s.generate);
  const generating = useStudioStore((s) => s.generating);
  const schema = useStudioStore((s) => s.schema);
  const errorCode = useStudioStore((s) => s.errorCode);
  const errorStatus = useStudioStore((s) => s.errorStatus);
  const errorMessage = useStudioStore((s) => s.errorMessage);
  const saveSchema = useStudioStore((s) => s.saveSchema);
  const saving = useStudioStore((s) => s.saving);
  const saveState = useStudioStore((s) => s.saveState);

  const errorParams: Record<string, string | number> | undefined =
    errorCode === 'http' && errorStatus
      ? { status: errorStatus }
      : errorCode === 'unknown' && errorMessage
        ? { message: errorMessage }
        : undefined;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <AiProviderWarning />

      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t('nav.studio')}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>{t('studio.subtitle')}</Text>
      </View>

      {!isAdmin ? (
        <View style={[styles.roleNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="lock-closed" size={18} color={colors.accent} />
          <Text style={[styles.roleNoteText, { color: colors.textMuted }]}>
            {t('studio.roleNote', { role: 'admin' })}
          </Text>
        </View>
      ) : (
        <View style={styles.columns}>
          {/* Left pane — schema generator */}
          <View style={styles.col}>
            <AdminCard title={t('studio.generatorTitle')}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t('studio.kind')}</Text>
              <View style={styles.kindRow}>
                {KIND_OPTIONS.map((opt) => {
                  const active = kind === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => setKind(opt.value)}
                      style={[
                        styles.kindChip,
                        { borderColor: active ? colors.primary : colors.border },
                        { backgroundColor: active ? colors.primaryContainer : colors.surfaceAlt },
                      ]}
                    >
                      <Ionicons name={opt.icon} size={14} color={active ? colors.onPrimaryContainer : colors.textMuted} />
                      <Text
                        style={[
                          styles.kindChipText,
                          { color: active ? colors.onPrimaryContainer : colors.text },
                        ]}
                      >
                        {t(opt.labelKey)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 6 }]}>
                {t('studio.promptLabel')}
              </Text>
              <TextInput
                mode="outlined"
                value={prompt}
                onChangeText={setPrompt}
                placeholder={t('studio.promptPlaceholder')}
                multiline
                style={styles.promptInput}
              />

              <View style={styles.generateRow}>
                <Button
                  mode="contained"
                  onPress={() => void generate()}
                  disabled={!prompt.trim() || generating}
                  loading={generating}
                  icon="sparkles"
                >
                  {generating ? t('studio.generating') : t('studio.generate')}
                </Button>
              </View>

              {errorCode ? (
                <View style={[styles.errorBox, { backgroundColor: colors.error, borderColor: colors.border }]}>
                  <Ionicons name="alert-circle" size={16} color="#ffffff" />
                  <Text style={styles.errorText}>
                    {errorCode === 'unknown' && !errorMessage
                      ? t('studio.errUnknown', { message: '' })
                      : t(ERROR_KEYS[errorCode], errorParams)}
                  </Text>
                </View>
              ) : null}
            </AdminCard>
          </View>

          {/* Right pane — live preview + chat refinement */}
          <View style={styles.col}>
            <AdminCard
              title={t('studio.previewTitle')}
              actions={
                schema ? (
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => void saveSchema()}
                    loading={saving}
                    disabled={saving}
                    textColor={colors.primary}
                    icon={saveState === 'saved' ? 'check' : 'cloud-upload-outline'}
                  >
                    {saving ? t('studio.saving') : t('studio.save')}
                  </Button>
                ) : undefined
              }
            >
              <SchemaPreview schema={schema} />
              {saveState === 'saved' ? (
                <Text style={{ color: colors.success, fontSize: 13, marginTop: 10 }}>
                  ✓ {t('studio.saved')}
                </Text>
              ) : null}
              {saveState === 'error' ? (
                <View style={[styles.notice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
                  <Ionicons name="warning" size={16} color="#ffffff" />
                  <Text style={styles.noticeText}>{t('studio.dbNotReady')}</Text>
                </View>
              ) : null}
            </AdminCard>

            <AdminCard title={t('studio.chatTitle')}>
              <ChatPanel />
            </AdminCard>
          </View>
        </View>
      )}
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
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  kindRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  kindChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  kindChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  promptInput: {
    marginBottom: 12,
  },
  generateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 17,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  noticeText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 17,
  },
  roleNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    maxWidth: 640,
  },
  roleNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});
