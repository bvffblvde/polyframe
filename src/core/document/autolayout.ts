import { gridHugHeight, hugSize, layoutGrid, layoutStack, type GridLayout, type StackLayout } from "../geometry/autolayout";
import type { ID, Node, Project, Rect } from "./types";

export const LAYOUT_TYPES = new Set(["stack", "grid"]);

export function isLayout(n: Node | undefined): n is Node {
  return Boolean(n && LAYOUT_TYPES.has(n.type));
}

export function layoutParent(p: Project, n: Node): Node | undefined {
  const parent = n.parentId ? p.nodes[n.parentId] : undefined;
  return isLayout(parent) && parent.artboardId === n.artboardId ? parent : undefined;
}

export function readStackLayout(n: Node): StackLayout {
  const v = n.props;
  const num = (x: unknown, d: number) => (typeof x === "number" && Number.isFinite(x) ? Math.max(0, x) : d);
  return {
    direction: v.direction === "row" ? "row" : "column",
    gap: num(v.gap, 8),
    padding: num(v.padding, 0),
    align: v.align === "center" || v.align === "end" || v.align === "stretch" ? v.align : "start",
    justify: v.justify === "center" || v.justify === "end" || v.justify === "between" ? v.justify : "start",
    hug: v.hug === true,
  };
}

export function readGridLayout(n: Node): GridLayout {
  const v = n.props;
  const num = (x: unknown, d: number) => (typeof x === "number" && Number.isFinite(x) ? Math.max(0, x) : d);
  return {
    columns: Math.min(12, Math.max(1, Math.round(num(v.columns, 3)))),
    columnGap: num(v.columnGap, 16),
    rowGap: num(v.rowGap, 16),
    padding: num(v.padding, 0),
    fill: v.fill !== false,
    align: v.align === "center" || v.align === "end" || v.align === "stretch" ? v.align : "start",
    hug: v.hug !== false,
  };
}

function layoutChildRects(container: Node, kids: Node[]): Rect[] {
  return container.type === "grid"
    ? layoutGrid(container, readGridLayout(container), kids)
    : layoutStack(container, readStackLayout(container), kids);
}

function hugRect(container: Node, kids: Node[]): Rect | null {
  if (container.type === "grid") {
    const layout = readGridLayout(container);
    return layout.hug ? { x: container.x, y: container.y, w: container.w, h: gridHugHeight(layout, kids) } : null;
  }
  const layout = readStackLayout(container);
  return layout.hug ? { x: container.x, y: container.y, ...hugSize(layout, kids) } : null;
}

function childrenMap(p: Project): Map<ID, ID[]> {
  const map = new Map<ID, ID[]>();
  for (const aid of p.artboardOrder) {
    for (const id of p.artboards[aid].childOrder) {
      const n = p.nodes[id];
      const parent = n && layoutParent(p, n);
      if (parent) map.set(parent.id, [...(map.get(parent.id) ?? []), id]);
    }
  }
  return map;
}

export function layoutChildren(p: Project, stackId: ID): ID[] {
  return childrenMap(p).get(stackId) ?? [];
}

export function descendants(p: Project, id: ID): ID[] {
  const map = childrenMap(p);
  const out: ID[] = [];
  const walk = (x: ID) => {
    for (const c of map.get(x) ?? []) {
      out.push(c);
      walk(c);
    }
  };
  walk(id);
  return out;
}

function normalizeOrder(p: Project): Project {
  const map = childrenMap(p);
  if (!map.size) return p;
  const artboards = { ...p.artboards };
  let changed = false;
  for (const aid of p.artboardOrder) {
    const a = p.artboards[aid];
    const order: ID[] = [];
    const emit = (id: ID) => {
      order.push(id);
      for (const c of map.get(id) ?? []) emit(c);
    };
    for (const id of a.childOrder) {
      const n = p.nodes[id];
      if (n && !layoutParent(p, n)) emit(id);
    }
    if (order.length !== a.childOrder.length || order.some((id, i) => id !== a.childOrder[i])) {
      artboards[aid] = { ...a, childOrder: order };
      changed = true;
    }
  }
  return changed ? { ...p, artboards } : p;
}

function depth(p: Project, n: Node): number {
  let d = 0;
  let cur = layoutParent(p, n);
  while (cur && d < 32) {
    d++;
    cur = layoutParent(p, cur);
  }
  return d;
}

const same = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

export function applyAutoLayout(input: Project): Project {
  let p = normalizeOrder(input);
  const stacks = Object.values(p.nodes).filter(isLayout);
  if (!stacks.length) return p;
  const nodes = { ...p.nodes };
  let changed = false;
  const set = (id: ID, r: Rect) => {
    const n = nodes[id];
    if (same(n, r)) return;
    nodes[id] = { ...n, ...r };
    changed = true;
  };
  const map = childrenMap(p);
  const visibleKids = (id: ID) => (map.get(id) ?? []).filter((c) => !nodes[c].hidden);
  const byDepth = [...stacks].sort((a, b) => depth(p, b) - depth(p, a));
  for (const s of byDepth) {
    const kids = visibleKids(s.id);
    if (!kids.length) continue;
    if (s.type === "grid") {
      const rects = layoutChildRects(nodes[s.id], kids.map((k) => nodes[k]));
      kids.forEach((k, i) => set(k, { ...nodes[k], w: rects[i].w, h: rects[i].h }));
    }
    const hug = hugRect(nodes[s.id], kids.map((k) => nodes[k]));
    if (hug) set(s.id, hug);
  }
  for (const s of [...byDepth].reverse()) {
    const kids = visibleKids(s.id);
    if (!kids.length) continue;
    const rects = layoutChildRects(nodes[s.id], kids.map((k) => nodes[k]));
    kids.forEach((k, i) => set(k, rects[i]));
  }
  if (changed) p = { ...p, nodes };
  return p;
}

export function setParent(p: Project, ids: ID[], parentId: ID | undefined): Project {
  const parent = parentId ? p.nodes[parentId] : undefined;
  if (parentId && !isLayout(parent)) return p;
  const blocked = new Set(parentId ? [parentId] : []);
  const nodes = { ...p.nodes };
  let changed = false;
  for (const id of ids) {
    const n = nodes[id];
    if (!n || blocked.has(id) || (parent && (n.artboardId !== parent.artboardId || descendants(p, id).includes(parent.id)))) continue;
    const next = { ...n };
    if (parentId) next.parentId = parentId;
    else if (isLayout(p.nodes[n.parentId ?? ""])) delete next.parentId;
    else continue;
    nodes[id] = next;
    changed = true;
  }
  return changed ? { ...p, nodes } : p;
}

export function insertionIndex(p: Project, stackId: ID, point: { x: number; y: number }, exclude: ID[] = []): number {
  const s = p.nodes[stackId];
  const kids = layoutChildren(p, stackId).filter((id) => !exclude.includes(id));
  const grid = s.type === "grid";
  const row = !grid && readStackLayout(s).direction === "row";
  const idx = kids.findIndex((id) => {
    const k = p.nodes[id];
    if (grid) return point.y < k.y || (point.y < k.y + k.h && point.x < k.x + k.w / 2);
    return row ? point.x < k.x + k.w / 2 : point.y < k.y + k.h / 2;
  });
  return idx === -1 ? kids.length : idx;
}

export function placeInLayout(p: Project, ids: ID[], stackId: ID, index: number): Project {
  let next = setParent(p, ids, stackId);
  const moving = ids.filter((id) => next.nodes[id]?.parentId === stackId);
  if (!moving.length) return next;
  const a = next.artboards[next.nodes[stackId].artboardId];
  const siblings = layoutChildren(next, stackId).filter((id) => !moving.includes(id));
  const anchor = siblings[index];
  const rest = a.childOrder.filter((id) => !moving.includes(id));
  const at = anchor ? rest.indexOf(anchor) : rest.indexOf(siblings[siblings.length - 1] ?? stackId) + 1;
  rest.splice(at, 0, ...moving);
  next = { ...next, artboards: { ...next.artboards, [a.id]: { ...a, childOrder: rest } } };
  return applyAutoLayout(next);
}

export function wrapInStack(p: Project, ids: ID[], stack: Node): Project {
  const members = ids.map((id) => p.nodes[id]).filter((n): n is Node => Boolean(n) && n.artboardId === stack.artboardId);
  if (!members.length) return p;
  const xs = members.map((n) => n.x);
  const ys = members.map((n) => n.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(...members.map((n) => n.x + n.w)) - x;
  const h = Math.max(...members.map((n) => n.y + n.h)) - y;
  const row = w - Math.max(...members.map((n) => n.w)) > h - Math.max(...members.map((n) => n.h));
  const sorted = [...members].sort((a, b) => (row ? a.x - b.x : a.y - b.y));
  const gaps = sorted.slice(1).map((n, i) => (row ? n.x - (sorted[i].x + sorted[i].w) : n.y - (sorted[i].y + sorted[i].h)));
  const gap = gaps.length ? Math.max(0, Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length)) : 8;
  const node: Node = { ...stack, x, y, w, h, props: { ...stack.props, direction: row ? "row" : "column", gap, padding: 0, hug: true } };
  const a = p.artboards[stack.artboardId];
  const firstIndex = Math.min(...members.map((n) => a.childOrder.indexOf(n.id)));
  const childOrder = a.childOrder.filter((id) => !members.some((m) => m.id === id));
  childOrder.splice(firstIndex, 0, node.id, ...sorted.map((n) => n.id));
  const nodes = { ...p.nodes, [node.id]: node };
  for (const m of sorted) {
    const c = { ...m, parentId: node.id };
    nodes[m.id] = c;
  }
  return applyAutoLayout({ ...p, nodes, artboards: { ...p.artboards, [a.id]: { ...a, childOrder } } });
}

export function unwrapLayout(p: Project, stackId: ID): Project {
  const s = p.nodes[stackId];
  if (!isLayout(s)) return p;
  const kids = layoutChildren(p, stackId);
  const nodes = { ...p.nodes };
  for (const id of kids) {
    const c = { ...nodes[id] };
    if (s.parentId) c.parentId = s.parentId;
    else delete c.parentId;
    nodes[id] = c;
  }
  delete nodes[stackId];
  const a = p.artboards[s.artboardId];
  return applyAutoLayout({
    ...p,
    nodes,
    artboards: { ...p.artboards, [a.id]: { ...a, childOrder: a.childOrder.filter((id) => id !== stackId) } },
  });
}

export function wrapInGrid(p: Project, ids: ID[], grid: Node): Project {
  const members = ids.map((id) => p.nodes[id]).filter((n): n is Node => Boolean(n) && n.artboardId === grid.artboardId);
  if (!members.length) return p;
  const sorted = [...members].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows: Node[][] = [];
  for (const n of sorted) {
    const last = rows[rows.length - 1];
    if (last && n.y < Math.max(...last.map((m) => m.y + m.h))) last.push(n);
    else rows.push([n]);
  }
  for (const r of rows) r.sort((a, b) => a.x - b.x);
  const messy = rows.some((r) => r.some((n, i) => i > 0 && n.x < r[i - 1].x + r[i - 1].w));
  const columns = messy ? Math.min(3, members.length) : Math.min(12, Math.max(...rows.map((r) => r.length)));
  const ordered = messy ? sorted : rows.flat();
  const left = Math.min(...members.map((n) => n.x));
  const y = Math.min(...members.map((n) => n.y));
  const avg = (xs: number[], d: number) => (xs.length ? Math.max(0, Math.round(xs.reduce((s, v) => s + v, 0) / xs.length)) : d);
  const columnGap = messy ? 16 : avg(rows.flatMap((r) => r.slice(1).map((n, i) => n.x - (r[i].x + r[i].w))), 16);
  const rowGap = messy ? 16 : avg(rows.slice(1).map((r, i) => Math.min(...r.map((n) => n.y)) - Math.max(...rows[i].map((n) => n.y + n.h))), 16);
  const widest = Math.max(...members.map((n) => n.w));
  const w = Math.max(Math.max(...members.map((n) => n.x + n.w)) - left, columns * widest + columnGap * (columns - 1));
  const h = Math.max(...members.map((n) => n.y + n.h)) - y;
  const x = Math.max(0, Math.min(left, p.artboards[grid.artboardId].width - w));
  const node: Node = { ...grid, x, y, w, h, props: { ...grid.props, columns, columnGap, rowGap, padding: 0, hug: true } };
  const a = p.artboards[grid.artboardId];
  const firstIndex = Math.min(...members.map((n) => a.childOrder.indexOf(n.id)));
  const childOrder = a.childOrder.filter((id) => !members.some((m) => m.id === id));
  childOrder.splice(firstIndex, 0, node.id, ...ordered.map((n) => n.id));
  const nodes = { ...p.nodes, [node.id]: node };
  for (const m of ordered) nodes[m.id] = { ...m, parentId: node.id };
  return applyAutoLayout({ ...p, nodes, artboards: { ...p.artboards, [a.id]: { ...a, childOrder } } });
}
