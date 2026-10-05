import { hugSize, layoutStack, type StackLayout } from "../geometry/autolayout";
import type { ID, Node, Project, Rect } from "./types";

export const STACK_TYPE = "stack";

export function isStack(n: Node | undefined): n is Node {
  return n?.type === STACK_TYPE;
}

export function stackParent(p: Project, n: Node): Node | undefined {
  const parent = n.parentId ? p.nodes[n.parentId] : undefined;
  return isStack(parent) && parent.artboardId === n.artboardId ? parent : undefined;
}

export function readLayout(n: Node): StackLayout {
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

function childrenMap(p: Project): Map<ID, ID[]> {
  const map = new Map<ID, ID[]>();
  for (const aid of p.artboardOrder) {
    for (const id of p.artboards[aid].childOrder) {
      const n = p.nodes[id];
      const parent = n && stackParent(p, n);
      if (parent) map.set(parent.id, [...(map.get(parent.id) ?? []), id]);
    }
  }
  return map;
}

export function stackChildren(p: Project, stackId: ID): ID[] {
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
      if (n && !stackParent(p, n)) emit(id);
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
  let cur = stackParent(p, n);
  while (cur && d < 32) {
    d++;
    cur = stackParent(p, cur);
  }
  return d;
}

const same = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

export function applyAutoLayout(input: Project): Project {
  let p = normalizeOrder(input);
  const stacks = Object.values(p.nodes).filter(isStack);
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
    const layout = readLayout(s);
    const kids = visibleKids(s.id);
    if (layout.hug && kids.length) {
      const size = hugSize(layout, kids.map((k) => nodes[k]));
      set(s.id, { x: nodes[s.id].x, y: nodes[s.id].y, ...size });
    }
  }
  for (const s of [...byDepth].reverse()) {
    const kids = visibleKids(s.id);
    if (!kids.length) continue;
    const rects = layoutStack(nodes[s.id], readLayout(nodes[s.id]), kids.map((k) => nodes[k]));
    kids.forEach((k, i) => set(k, rects[i]));
  }
  if (changed) p = { ...p, nodes };
  return p;
}

export function setParent(p: Project, ids: ID[], parentId: ID | undefined): Project {
  const parent = parentId ? p.nodes[parentId] : undefined;
  if (parentId && !isStack(parent)) return p;
  const blocked = new Set(parentId ? [parentId] : []);
  const nodes = { ...p.nodes };
  let changed = false;
  for (const id of ids) {
    const n = nodes[id];
    if (!n || blocked.has(id) || (parent && (n.artboardId !== parent.artboardId || descendants(p, id).includes(parent.id)))) continue;
    const next = { ...n };
    if (parentId) next.parentId = parentId;
    else if (isStack(p.nodes[n.parentId ?? ""])) delete next.parentId;
    else continue;
    nodes[id] = next;
    changed = true;
  }
  return changed ? { ...p, nodes } : p;
}

export function insertionIndex(p: Project, stackId: ID, point: { x: number; y: number }, exclude: ID[] = []): number {
  const s = p.nodes[stackId];
  const row = readLayout(s).direction === "row";
  const kids = stackChildren(p, stackId).filter((id) => !exclude.includes(id));
  const idx = kids.findIndex((id) => {
    const k = p.nodes[id];
    return row ? point.x < k.x + k.w / 2 : point.y < k.y + k.h / 2;
  });
  return idx === -1 ? kids.length : idx;
}

export function placeInStack(p: Project, ids: ID[], stackId: ID, index: number): Project {
  let next = setParent(p, ids, stackId);
  const moving = ids.filter((id) => next.nodes[id]?.parentId === stackId);
  if (!moving.length) return next;
  const a = next.artboards[next.nodes[stackId].artboardId];
  const siblings = stackChildren(next, stackId).filter((id) => !moving.includes(id));
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

export function unwrapStack(p: Project, stackId: ID): Project {
  const s = p.nodes[stackId];
  if (!isStack(s)) return p;
  const kids = stackChildren(p, stackId);
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
