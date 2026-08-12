import { useState } from 'react';
import { ComponentProps } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../theme';
import { useUiStore, type SectionId } from '../../store/uiStore';
import { useSettingsStore, type ThemeMode } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { THEME_LABEL_KEYS, useI18n, type TranslationKey } from '../../i18n';
import DashboardScreen from '../../screens/DashboardScreen';
import StudioScreen from '../../screens/StudioScreen';
import WorkflowScreen from '../../screens/WorkflowScreen';
import ReportsScreen from '../../screens/ReportsScreen';
import SettingsScreen from '../../screens/SettingsScreen';

type IconName = ComponentProps<typeof Ionicons>['name'];

const SIDEBAR_WIDTH = 250;
const DESKTOP_MIN_WIDTH = 900;

interface NavItem {
  id: SectionId;
  labelKey: TranslationKey;
  icon: IconName;
  iconActive: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: 'speedometer-outline', iconActive: 'speedometer' },
  { id: 'studio', labelKey: 'nav.studio', icon: 'flash-outline', iconActive: 'flash' },
  { id: 'workflow', labelKey: 'nav.workflow', icon: 'git-network-outline', iconActive: 'git-network' },
  { id: 'reports', labelKey: 'nav.reports', icon: 'document-text-outline', iconActive: 'document-text' },
  { id: 'settings', labelKey: 'nav.settings', icon: 'settings-outline', iconActive: 'settings' },
];

function screenFor(id: SectionId) {
  switch (id) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'studio':
      return <StudioScreen />;
    case 'workflow':
      return <WorkflowScreen />;
    case 'reports':
      return <ReportsScreen />;
    default:
      return <SettingsScreen />;
  }
}

/** AdminLTE-style dark sidebar. `onNavigate` is used by the mobile drawer. */
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const section = useUiStore((s) => s.section);
  const setSection = useUiStore((s) => s.setSection);

  return (
    <SafeAreaView edges={['top']} style={[styles.sidebar, { backgroundColor: colors.sidebar }]}>
      <View style={styles.brand}>
        <View style={[styles.brandIcon, { backgroundColor: colors.sidebarAccent }]}>
          <Ionicons name="speedometer" size={18} color="#ffffff" />
        </View>
        <Text style={styles.brandText}>VeloForm</Text>
      </View>
      <ScrollView contentContainerStyle={styles.navList} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => {
          const active = section === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                setSection(item.id);
                onNavigate?.();
              }}
              style={[
                styles.navItem,
                active && { backgroundColor: colors.sidebarActiveBg },
                active && { borderLeftColor: colors.sidebarAccent },
              ]}
            >
              <Ionicons
                name={active ? item.iconActive : item.icon}
                size={20}
                color={active ? '#ffffff' : colors.sidebarMuted}
              />
              <Text
                style={[
                  styles.navLabel,
                  { color: active ? '#ffffff' : colors.sidebarText },
                  active && styles.navLabelActive,
                ]}
              >
                {t(item.labelKey)}
              </Text>
              {active ? <View style={[styles.navDot, { backgroundColor: colors.sidebarAccent }]} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={[styles.sidebarFooter, { borderTopColor: colors.sidebarActiveBg }]}>
        <Ionicons name="cube-outline" size={14} color={colors.sidebarMuted} />
        <Text style={[styles.sidebarFooterText, { color: colors.sidebarMuted }]}>v0.1.0</Text>
      </View>
    </SafeAreaView>
  );
}

/** Mobile drawer: overlay sidebar + dim backdrop. */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { colors } = useAppTheme();
  if (!open) return null;
  return (
    <View style={styles.drawerLayer}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.drawer, { backgroundColor: colors.sidebar }]}>
        <Sidebar onNavigate={onClose} />
      </View>
    </View>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const section = useUiStore((s) => s.section);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const { t } = useI18n();
  const isDesktop = width >= DESKTOP_MIN_WIDTH;
  const current = NAV_ITEMS.find((n) => n.id === section);

  const cycleTheme = () => {
    const next: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';
    setThemeMode(next);
  };

  const initials = (profile?.full_name ?? profile?.email ?? '?').charAt(0).toUpperCase();

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.topbar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
    >
      <View style={styles.topbarInner}>
        {!isDesktop ? (
          <Pressable onPress={onMenu} hitSlop={8} style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </Pressable>
        ) : null}
        <Text style={[styles.pageTitle, { color: colors.text }]} numberOfLines={1}>
          {current ? t(current.labelKey) : 'VeloForm'}
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable onPress={cycleTheme} hitSlop={8} style={[styles.themeChip, { borderColor: colors.border }]}>
          <Ionicons
            name={themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sunny' : 'contrast'}
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.themeChipText, { color: colors.textMuted }]}>{t(THEME_LABEL_KEYS[themeMode])}</Text>
        </Pressable>
        {profile ? (
          <View style={styles.userArea}>
            {isDesktop && profile.business_name ? (
              <View style={[styles.bizChip, { borderColor: colors.border }]}>
                <Ionicons name="business" size={13} color={colors.primary} />
                <Text style={[styles.bizChipText, { color: colors.textMuted }]} numberOfLines={1}>
                  {profile.business_name}
                </Text>
              </View>
            ) : null}
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <Pressable onPress={() => void signOut()} hitSlop={8} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

/**
 * R-029: AdminLTE-style application shell. Dark sidebar with navigation on the
 * left, topbar with page title, and a scrollable content area per section.
 * The sidebar is always visible on wide (desktop/web) screens and becomes a
 * slide-in drawer on narrow (phone) screens.
 */
export default function AdminShell() {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const section = useUiStore((s) => s.section);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = width >= DESKTOP_MIN_WIDTH;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {isDesktop ? <Sidebar /> : null}
      <MobileDrawer open={!isDesktop && drawerOpen} onClose={() => setDrawerOpen(false)} />
      <View style={styles.main}>
        <Topbar onMenu={() => setDrawerOpen(true)} />
        <View style={styles.content}>{screenFor(section)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  topbar: {
    borderBottomWidth: 1,
  },
  topbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  menuBtn: {
    marginRight: 8,
    padding: 4,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  themeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
  },
  bizChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: 200,
  },
  bizChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    padding: 4,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  navList: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  navLabelActive: {
    fontWeight: '700',
  },
  navDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sidebarFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sidebarFooterText: {
    fontSize: 12,
  },
  drawerLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 0 },
    elevation: 12,
  },
});
