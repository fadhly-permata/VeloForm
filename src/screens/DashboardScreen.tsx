import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { useAppTheme } from '../theme';
import { useUiStore, type SectionId } from '../store/uiStore';
import { useAiStore } from '../store/aiStore';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { THEME_LABEL_KEYS, useI18n, type TranslationKey } from '../i18n';
import StatCard from '../components/admin/StatCard';
import AdminCard from '../components/admin/AdminCard';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface QuickLink {
  section: SectionId;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: IconName;
  color: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    section: 'studio',
    labelKey: 'dash.openStudio',
    descriptionKey: 'dash.studioDesc',
    icon: 'flash',
    color: '#2563eb',
  },
  {
    section: 'workflow',
    labelKey: 'dash.openWorkflow',
    descriptionKey: 'dash.workflowDesc',
    icon: 'git-network',
    color: '#16a34a',
  },
  {
    section: 'reports',
    labelKey: 'dash.openReports',
    descriptionKey: 'dash.reportsDesc',
    icon: 'document-text',
    color: '#f59e0b',
  },
  {
    section: 'settings',
    labelKey: 'dash.openSettings',
    descriptionKey: 'dash.settingsDesc',
    icon: 'settings',
    color: '#0d9488',
  },
];

/** R-029: AdminLTE-style dashboard (content header + small-box stats + boxes). */
export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const providers = useAiStore((s) => s.providers);
  const providersLoaded = useAiStore((s) => s.loaded);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setSection = useUiStore((s) => s.setSection);
  const profile = useAuthStore((s) => s.profile);

  const activeProviders = providers.filter((p) => p.isActive).length;
  const roleLabel = (profile?.role ?? '—').toUpperCase();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Content header (AdminLTE) */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t('nav.dashboard')}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>{t('dash.subtitle')}</Text>
      </View>

      {/* Small-box stats */}
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <StatCard
            label={t('dash.statAiActive')}
            value={providersLoaded ? t('dash.activeProviders', { count: activeProviders }) : '—'}
            icon="flash"
            color="#2563eb"
            note={t('dash.noteManageSettings')}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label={t('dash.statSchemas')}
            value={0}
            icon="grid"
            color="#0d9488"
            note={t('dash.noteStudioPhase')}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label={t('nav.workflow')}
            value={0}
            icon="git-network"
            color="#16a34a"
            note={t('dash.noteWorkflowPhase')}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label={t('dash.statReports')}
            value={0}
            icon="document-text"
            color="#f59e0b"
            note={t('dash.noteReportsPhase')}
          />
        </View>
      </View>

      {/* Two-column boxes */}
      <View style={styles.cardsRow}>
        <View style={styles.cardCol}>
          <AdminCard title={t('dash.quickStart')}>
            {QUICK_LINKS.map((link) => (
              <Pressable
                key={link.section}
                onPress={() => setSection(link.section)}
                style={[styles.quickLink, { borderColor: colors.border }]}
              >
                <View style={[styles.quickIcon, { backgroundColor: `${link.color}1a` }]}>
                  <Ionicons name={link.icon} size={18} color={link.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.quickLabel, { color: colors.text }]}>{t(link.labelKey)}</Text>
                  <Text style={[styles.quickDesc, { color: colors.textMuted }]}>
                    {t(link.descriptionKey)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </AdminCard>
        </View>
        <View style={styles.cardCol}>
          <AdminCard title={t('dash.appStatus')}>
            <StatusRow
              labelKey="dash.statusVersion"
              value="0.1.0"
              icon="cube-outline"
              color={colors.textMuted}
            />
            <StatusRow
              labelKey="dash.statusTheme"
              value={t(THEME_LABEL_KEYS[themeMode])}
              icon="color-palette-outline"
              color={colors.primary}
            />
            <StatusRow
              labelKey="dash.statusAiProvider"
              value={providersLoaded ? t('dash.activeProviders', { count: activeProviders }) : t('common.loading')}
              icon="flash-outline"
              color={colors.accent}
            />
            <StatusRow
              labelKey="dash.statusDatabase"
              value={t('dash.databaseValue')}
              icon="server-outline"
              color={colors.textMuted}
            />
            <StatusRow
              labelKey="dash.statusLogin"
              value={profile?.email ?? '—'}
              icon="log-in-outline"
              color={colors.textMuted}
            />
            <StatusRow
              labelKey="dash.statusBusiness"
              value={profile?.business_name ?? '—'}
              icon="business-outline"
              color={colors.primary}
            />
            <StatusRow
              labelKey="dash.statusRole"
              value={roleLabel}
              icon="shield-checkmark-outline"
              color={roleLabel === 'ADMIN' ? colors.success : colors.accent}
            />
          </AdminCard>
        </View>
      </View>
    </ScrollView>
  );
}

function StatusRow({
  labelKey,
  value,
  icon,
  color,
}: {
  labelKey: TranslationKey;
  value: string;
  icon: IconName;
  color: string;
}) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  return (
    <View style={styles.statusRow}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.statusLabel, { color: colors.textMuted }]}>{t(labelKey)}</Text>
      <Text style={[styles.statusValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statItem: {
    width: '25%',
    minWidth: 230,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
    marginTop: 8,
  },
  cardCol: {
    flex: 1,
    minWidth: 320,
    paddingHorizontal: 10,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    width: 110,
  },
  statusValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
});
