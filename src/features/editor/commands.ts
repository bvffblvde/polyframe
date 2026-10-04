import { newArtboard } from "@/core/document/factory";
import * as ops from "@/core/document/ops";
import type { ArtboardPreset, ComponentType, ID, Mode, Node, ProjectSettings } from "@/core/document/types";
import { boundsOf, centerRectAt } from "@/core/geometry/rect";
import { intersectRect } from "@/core/geometry/hit-test";
import { snapValue } from "@/core/geometry/snap";
import { centerOn, fitRect, stepZoom, visibleWorldRect } from "@/core/geometry/viewport";
import { registry, type Translator } from "@/core/registry";
import { createNode } from "@/core/registry/create-node";
import { newId } from "@/lib/ids";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

const doc = () => useDocumentStore.getState();
const ed = () => useEditorStore.getState();
const apply = (op: Parameters<ReturnType<typeof doc>["apply"]>[0]) => doc().apply(op);

function pruneSelection() {
  const p = doc().project;
  ed().select(ed().selection.filter((id) => p?.nodes[id]));
  if (p && !p.artboards[ed().activeArtboardId ?? ""]) ed().set({ activeArtboardId: p.artboardOrder[0] ?? null });
}

export function undo() {
  useDocumentStore.temporal.getState().undo();
  pruneSelection();
}

export function redo() {
  useDocumentStore.temporal.getState().redo();
  pruneSelection();
}

export function fitAll() {
  const p = doc().project;
  if (!p) return;
  const b = boundsOf(p.artboardOrder.map((id) => {
    const a = p.artboards[id];
    return { x: a.x, y: a.y, w: a.width, h: a.height };
  }));
  if (!b) return;
  ed().set({ viewport: fitRect(b, ed().viewSize) });
}

export function zoomTo(zoom: number) {
  const { viewport, viewSize } = ed();
  const center = { x: (viewSize.width / 2 - viewport.x) / viewport.zoom, y: (viewSize.height / 2 - viewport.y) / viewport.zoom };
  ed().set({ viewport: centerOn(center, zoom, viewSize) });
}

export function zoomStep(dir: 1 | -1) {
  zoomTo(stepZoom(ed().viewport.zoom, dir));
}

function activeArtboardId(): ID | null {
  const p = doc().project;
  if (!p) return null;
  const id = ed().activeArtboardId;
  return id && p.artboards[id] ? id : (p.artboardOrder[0] ?? null);
}

export function insertNode(
  type: ComponentType,
  t: Translator,
  name: string,
  at?: { artboardId: ID; x: number; y: number },
): Node | null {
  const p = doc().project;
  const artboardId = at?.artboardId ?? activeArtboardId();
  if (!p || !artboardId) return null;
  const a = p.artboards[artboardId];
  const def = registry[type];
  let center = at ? { x: at.x, y: at.y } : { x: a.width / 2, y: a.height / 2 };
  if (!at) {
    const visible = visibleWorldRect(ed().viewport, ed().viewSize);
    const overlap = intersectRect(visible, { x: a.x, y: a.y, w: a.width, h: a.height });
    if (overlap) center = { x: overlap.x + overlap.w / 2 - a.x, y: overlap.y + overlap.h / 2 - a.y };
  }
  const rect = centerRectAt(center, def.defaultSize);
  if (p.settings.grid.enabled) {
    rect.x = snapValue(rect.x, p.settings.grid.size);
    rect.y = snapValue(rect.y, p.settings.grid.size);
  }
  const node = createNode({ id: newId(), type, artboardId, rect, name, t });
  apply((pr) => ops.addNodes(pr, [node]));
  ed().set({ selection: [node.id], activeArtboardId: artboardId });
  return node;
}

export function deleteSelection(): number {
  const ids = ed().selection;
  if (!ids.length) return 0;
  apply((p) => ops.removeNodes(p, ids));
  ed().select([]);
  return ids.length;
}

export function duplicateSelection(): number {
  const ids = ed().selection;
  if (!ids.length) return 0;
  let out: ID[] = [];
  apply((p) => {
    const r = ops.duplicateNodes(p, ids, newId);
    out = r.ids;
    return r.project;
  });
  ed().select(out);
  return out.length;
}

export function copySelection(): number {
  const p = doc().project;
  if (!p) return 0;
  const nodes = ops.orderedNodes(p, ed().selection);
  if (nodes.length) ed().set({ clipboard: structuredClone(nodes) });
  return nodes.length;
}

export function paste(): number {
  const clip = ed().clipboard;
  const artboardId = activeArtboardId();
  if (!clip.length || !artboardId) return 0;
  const sameArtboard = clip.every((n) => n.artboardId === artboardId);
  let out: ID[] = [];
  apply((p) => {
    const r = ops.cloneNodesInto(p, clip, artboardId, newId, sameArtboard ? 16 : 0);
    out = r.ids;
    return r.project;
  });
  if (sameArtboard) ed().set({ clipboard: clip.map((n) => ({ ...n, x: n.x + 16, y: n.y + 16 })) });
  ed().select(out);
  return out.length;
}

export function nudge(dx: number, dy: number) {
  const ids = ed().selection;
  if (ids.length) apply((p) => ops.moveNodes(p, ids, dx, dy));
}

export function selectAll(): number {
  const p = doc().project;
  const artboardId = activeArtboardId();
  if (!p || !artboardId) return 0;
  const ids = p.artboards[artboardId].childOrder.filter((id) => !p.nodes[id].locked && !p.nodes[id].hidden);
  ed().select(ids);
  return ids.length;
}

export function clearSelection() {
  ed().select([]);
}

export function reorder(dir: ops.ZOrderDirection) {
  const ids = ed().selection;
  if (ids.length) apply((p) => ops.reorderNodes(p, ids, dir));
}

export function updateSettings(patch: Partial<ProjectSettings>) {
  apply((p) => ops.updateSettings(p, patch));
}

export function toggleMode(): Mode | null {
  const p = doc().project;
  if (!p) return null;
  const mode: Mode = p.settings.mode === "wireframe" ? "styled" : "wireframe";
  updateSettings({ mode });
  return mode;
}

export function toggleSnap(): boolean | null {
  const p = doc().project;
  if (!p) return null;
  const enabled = !p.settings.grid.enabled;
  updateSettings({ grid: { ...p.settings.grid, enabled } });
  return enabled;
}

export function addArtboard(preset: ArtboardPreset, name: string): ID | null {
  const p = doc().project;
  if (!p) return null;
  const a = newArtboard(p, { id: newId(), name, preset });
  apply((pr) => ops.addArtboard(pr, a));
  ed().set({ activeArtboardId: a.id, selection: [] });
  const vp = ed().viewport;
  ed().set({ viewport: centerOn({ x: a.x + a.width / 2, y: a.y + a.height / 2 }, vp.zoom, ed().viewSize) });
  return a.id;
}

export function removeArtboard(id: ID) {
  const p = doc().project;
  if (!p || p.artboardOrder.length <= 1) return;
  apply((pr) => ops.removeArtboard(pr, id));
  pruneSelection();
}
