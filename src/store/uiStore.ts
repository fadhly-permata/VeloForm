import { create } from 'zustand';

/** Sections rendered inside the admin shell (replaces bottom-tab navigator). */
export type SectionId = 'dashboard' | 'studio' | 'workflow' | 'reports' | 'settings';

interface UiState {
  section: SectionId;
  sidebarOpen: boolean;
  setSection: (section: SectionId) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  section: 'dashboard',
  sidebarOpen: false,

  setSection: (section) => set({ section, sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
