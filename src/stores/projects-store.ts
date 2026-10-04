import { create } from "zustand";
import { newArtboard } from "@/core/document/factory";
import { createProject, renameProject } from "@/core/document/ops";
import type { ArtboardPreset, ID, Project } from "@/core/document/types";
import { newId } from "@/lib/ids";
import * as idb from "@/lib/persistence/idb";
import type { ProjectMeta } from "@/lib/persistence/idb";
import { useDocumentStore } from "./document-store";
import { useEditorStore } from "./editor-store";

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

export interface NewProjectNames {
  project: string;
  artboard: (preset: ArtboardPreset, index: number) => string;
}

interface ProjectsState {
  list: ProjectMeta[];
  status: SaveStatus;
  ready: boolean;
}

export const useProjectsStore = create<ProjectsState>()(() => ({ list: [], status: "idle", ready: false }));

const setState = useProjectsStore.setState;

async function refresh() {
  setState({ list: await idb.listProjects() });
}

function stamp(p: Project): Project {
  return { ...p, updatedAt: new Date().toISOString() };
}

export function buildProject(names: NewProjectNames): Project {
  const artboard = newArtboard(null, { id: newId(), name: names.artboard("desktop", 1), preset: "desktop" });
  return createProject({ id: newId(), name: names.project, now: new Date().toISOString(), artboard });
}

function show(p: Project) {
  useDocumentStore.getState().load(p);
  useEditorStore.getState().set({
    selection: [],
    hoveredId: null,
    preview: null,
    marquee: null,
    activeArtboardId: p.artboardOrder[0] ?? null,
    fitRequest: Date.now(),
  });
}

export async function openProject(id: ID): Promise<boolean> {
  const p = await idb.loadProject(id);
  if (!p) return false;
  show(p);
  await idb.setLastProjectId(id);
  return true;
}

export async function createAndOpenProject(names: NewProjectNames): Promise<Project> {
  const p = buildProject(names);
  await idb.saveProject(p);
  await idb.setLastProjectId(p.id);
  show(p);
  await refresh();
  return p;
}

export async function initProjects(names: NewProjectNames): Promise<void> {
  await refresh();
  const last = await idb.getLastProjectId();
  const candidates = [last, ...useProjectsStore.getState().list.map((m) => m.id)].filter(
    (x): x is ID => Boolean(x),
  );
  let opened = false;
  for (const id of candidates) {
    if (await openProject(id)) {
      opened = true;
      break;
    }
  }
  if (!opened) await createAndOpenProject(names);
  setState({ ready: true, status: "saved" });
}

export async function renameProjectById(id: ID, name: string): Promise<void> {
  const current = useDocumentStore.getState().project;
  if (current?.id === id) {
    useDocumentStore.getState().apply((p) => renameProject(p, name));
    return;
  }
  const p = await idb.loadProject(id);
  if (!p) return;
  await idb.saveProject(stamp(renameProject(p, name)));
  await refresh();
}

export async function duplicateProject(id: ID, name: string): Promise<void> {
  const current = useDocumentStore.getState().project;
  const source = current?.id === id ? current : await idb.loadProject(id);
  if (!source) return;
  await idb.saveProject(stamp({ ...structuredClone(source), id: newId(), name, createdAt: new Date().toISOString() }));
  await refresh();
}

export async function removeProject(id: ID, names: NewProjectNames): Promise<void> {
  await idb.deleteProject(id);
  await refresh();
  if (useDocumentStore.getState().project?.id !== id) return;
  const next = useProjectsStore.getState().list[0];
  if (!next || !(await openProject(next.id))) await createAndOpenProject(names);
}

export async function importProject(project: Project): Promise<void> {
  const p = stamp({ ...project, id: newId() });
  await idb.saveProject(p);
  await idb.setLastProjectId(p.id);
  show(p);
  await refresh();
}

let timer: ReturnType<typeof setTimeout> | undefined;

export async function flushSave(): Promise<void> {
  clearTimeout(timer);
  const p = useDocumentStore.getState().project;
  if (!p) return;
  setState({ status: "saving" });
  try {
    await idb.saveProject(stamp(p));
    await refresh();
    setState({ status: "saved" });
  } catch {
    setState({ status: "error" });
  }
}

export function startAutosave(delay = 500): () => void {
  return useDocumentStore.subscribe((s, prev) => {
    if (!s.project || s.project === prev.project || s.project.id !== prev.project?.id) return;
    setState({ status: "pending" });
    clearTimeout(timer);
    timer = setTimeout(flushSave, delay);
  });
}
