import { createStore, del, get, set, type UseStore } from "idb-keyval";
import type { ID, Project } from "@/core/document/types";
import { parseProjectData } from "@/core/serialization/json";

export interface ProjectMeta {
  id: ID;
  name: string;
  updatedAt: string;
}

const INDEX_KEY = "projects:index";
const LAST_KEY = "projects:last";
const projectKey = (id: ID) => `project:${id}`;

let store: UseStore | undefined;
function db(): UseStore {
  store ??= createStore("polyframe", "kv");
  return store;
}

export async function listProjects(): Promise<ProjectMeta[]> {
  const index = (await get<ProjectMeta[]>(INDEX_KEY, db())) ?? [];
  return [...index].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveProject(p: Project): Promise<ProjectMeta> {
  const meta: ProjectMeta = { id: p.id, name: p.name, updatedAt: p.updatedAt };
  await set(projectKey(p.id), p, db());
  const index = (await get<ProjectMeta[]>(INDEX_KEY, db())) ?? [];
  await set(INDEX_KEY, [meta, ...index.filter((m) => m.id !== p.id)], db());
  return meta;
}

export async function loadProject(id: ID): Promise<Project | null> {
  const raw = await get<unknown>(projectKey(id), db());
  if (raw === undefined) return null;
  const r = parseProjectData(raw);
  return r.ok ? r.project : null;
}

export async function deleteProject(id: ID): Promise<void> {
  await del(projectKey(id), db());
  const index = (await get<ProjectMeta[]>(INDEX_KEY, db())) ?? [];
  await set(INDEX_KEY, index.filter((m) => m.id !== id), db());
}

export async function getLastProjectId(): Promise<ID | undefined> {
  return get<ID>(LAST_KEY, db());
}

export async function setLastProjectId(id: ID): Promise<void> {
  await set(LAST_KEY, id, db());
}
