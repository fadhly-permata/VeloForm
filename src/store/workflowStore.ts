import { create } from 'zustand';
import { runWorkflow, type RunLogEntry } from '../services/workflow';
import { listWorkflows, type WorkflowRecord } from '../services/dataRepo';
import type { FormValues } from '../services/runtime';

interface WorkflowState {
  workflows: WorkflowRecord[];
  loaded: boolean;
  dbError: boolean;
  selectedId: string | null;
  running: boolean;
  runLog: RunLogEntry[] | null;
  load: () => Promise<void>;
  select: (id: string) => void;
  run: (values: FormValues) => Promise<void>;
  clearLog: () => void;
}

export const useWorkflowStore = create<WorkflowState>()((set, get) => ({
  workflows: [],
  loaded: false,
  dbError: false,
  selectedId: null,
  running: false,
  runLog: null,

  load: async () => {
    set({ loaded: false, dbError: false });
    try {
      const workflows = await listWorkflows();
      set({ workflows, loaded: true });
    } catch {
      set({ workflows: [], loaded: true, dbError: true });
    }
  },

  select: (id) => set({ selectedId: id, runLog: null }),

  run: async (values) => {
    const { workflows, selectedId, running } = get();
    if (running) return;
    const workflow = workflows.find((w) => w.id === selectedId);
    if (!workflow) return;
    set({ running: true });
    // Small delay so the UI can show the running state.
    await new Promise((resolve) => setTimeout(resolve, 150));
    const result = runWorkflow(workflow.definition, values);
    set({ running: false, runLog: result.logs });
  },

  clearLog: () => set({ runLog: null }),
}));
