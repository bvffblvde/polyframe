import { create, useStore } from "zustand";
import { temporal } from "zundo";
import type { Project } from "@/core/document/types";

interface DocumentState {
  project: Project | null;
  apply: (op: (p: Project) => Project) => void;
  load: (p: Project) => void;
}

export const useDocumentStore = create<DocumentState>()(
  temporal(
    (set, get) => ({
      project: null,
      apply: (op) => {
        const p = get().project;
        if (!p) return;
        const next = op(p);
        if (next !== p) set({ project: next });
      },
      load: (project) => {
        set({ project });
        useDocumentStore.temporal.getState().clear();
      },
    }),
    {
      limit: 100,
      partialize: (s) => ({ project: s.project }),
      equality: (a, b) => a.project === b.project,
    },
  ),
);

export function useHistory() {
  const canUndo = useStore(useDocumentStore.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useDocumentStore.temporal, (s) => s.futureStates.length > 0);
  return { canUndo, canRedo };
}

export function useProject<T>(selector: (p: Project) => T): T | undefined {
  return useDocumentStore((s) => (s.project ? selector(s.project) : undefined));
}

export function applyOp(op: (p: Project) => Project) {
  useDocumentStore.getState().apply(op);
}
