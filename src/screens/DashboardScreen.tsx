import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { useAppTheme } from '../theme';
import { useUiStore, type SectionId } from '../store/uiStore';
import { useAiStore } from '../store/aiStore';
import { useSettingsStore, type ThemeMode } from '../store/settingsStore';
import StatCard from '../components/admin/StatCard';
import AdminCard from '../components/admin/AdminCard';

type IconName = ComponentProps<typeof Ionicons>['name'];

const MODE_LABEL: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', auto: 'Auto' };

interface QuickLink {
  section: SectionId;
  label: string;
  description: string;
  icon: IconName;
  color: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    section: 'studio',
    label: 'Buka Studio',
    description: 'Generate Master, Transaction, Report & Workflow dari prompt teks.',
    icon: 'flash',
    color: '#2563eb',
  },
  {
    section: 'workflow',
    label: 'Buka Workflow',
    description: 'Atur trigger form, cron scheduler, dan alur keputusan bisnis.',
    icon: 'git-network',
    color: '#16a34a',
  },
  {
    section: 'reports',
    label: 'Buka Reports',
    description: 'Lihat Master, Transactions, dan laporan data operasional.',
    icon: 'document-text',
    color: '#f59e0b',
  },
  {
    section: 'settings',
    label: 'Buka Settings',
    description: 'Kelola tema aplikasi dan konfigurasi AI provider.',
    icon: 'settings',
    color: '#0d9488',
  },
];

/** R-029: AdminLTE-style dashboard (content header + small-box stats + boxes). */
export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const providers = useAiStore((s) => s.providers);
  const providersLoaded = useAiStore((s) => s.loaded);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setSection = useUiStore((s) => s.setSection);

  const activeProviders = providers.filter((p) => p.isActive).length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Content header (AdminLTE) */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
          Ringkasan status aplikasi dan akses cepat ke modul VeloForm
        </Text>
      </View>

      {/* Small-box stats */}
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <StatCard
            label="AI Provider Aktif"
            value={providersLoaded ? activeProviders : '—'}
            icon="flash"
            color="#2563eb"
            note="Kelola di Settings"
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Skema Form"
            value={0}
            icon="grid"
            color="#0d9488"
            note="Fase 3 — Studio generate"
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Workflow"
            value={0}
            icon="git-network"
            color="#16a34a"
            note="Fase 4 — Runtime & workflow"
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Laporan"
            value={0}
            icon="document-text"
            color="#f59e0b"
            note="Fase 5 — Data bisnis"
          />
        </View>
      </View>

      {/* Two-column boxes */}
      <View style={styles.cardsRow}>
        <View style={styles.cardCol}>
          <AdminCard title="Mulai Cepat">
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
                  <Text style={[styles.quickLabel, { color: colors.text }]}>{link.label}</Text>
                  <Text style={[styles.quickDesc, { color: colors.textMuted }]}>{link.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </AdminCard>
        </View>
        <View style={styles.cardCol}>
          <AdminCard title="Status Aplikasi">
            <StatusRow
              label="Versi"
              value="0.1.0"
              icon="cube-outline"
              color={colors.textMuted}
            />
            <StatusRow
              label="Tema"
              value={MODE_LABEL[themeMode]}
              icon="color-palette-outline"
              color={colors.primary}
            />
            <StatusRow
              label="AI Provider"
              value={providersLoaded ? `${activeProviders} aktif` : 'Memuat…'}
              icon="flash-outline"
              color={colors.accent}
            />
            <StatusRow
              label="Database"
              value="SQLite lokal"
              icon="server-outline"
              color={colors.textMuted}
            />
            <StatusRow
              label="Login"
              value="Google OAuth (R-030)"
              icon="log-in-outline"
              color={colors.textMuted}
            />
            <StatusRow
              label="Database cloud"
              value="Supabase menyusul (R-028)"
              icon="cloud-outline"
              color={colors.textMuted}
            />
          </AdminCard>
        </View>
      </View>
    </ScrollView>
  );
}

function StatusRow({ label, value, icon, color }: { label: string; value: string; icon: IconName; color: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.statusRow}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.statusLabel, { color: colors.textMuted }]}>{label}</Text>
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
