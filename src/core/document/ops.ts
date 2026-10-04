import type { Artboard, ID, IdGen, Node, NodeStyle, Project, ProjectSettings, Rect } from "./types";

export type ZOrderDirection = "forward" | "backward" | "front" | "back";

export function createProject(opts: {
  id: ID;
  name: string;
  now: string;
  artboard: Artboard;
  settings?: Partial<ProjectSettings>;
}): Project {
  return {
    schemaVersion: 1,
    id: opts.id,
    name: opts.name,
    createdAt: opts.now,
    updatedAt: opts.now,
    settings: {
      mode: "wireframe",
      skin: "shadcn",
      grid: { enabled: true, size: 8, visible: true },
      sketchFont: false,
      ...opts.settings,
    },
    artboards: { [opts.artboard.id]: opts.artboard },
    artboardOrder: [opts.artboard.id],
    nodes: {},
  };
}

export function renameProject(p: Project, name: string): Project {
  return { ...p, name };
}

export function updateSettings(p: Project, patch: Partial<ProjectSettings>): Project {
  return { ...p, settings: { ...p.settings, ...patch, grid: { ...p.settings.grid, ...patch.grid } } };
}

export function addArtboard(p: Project, artboard: Artboard): Project {
  return {
    ...p,
    artboards: { ...p.artboards, [artboard.id]: artboard },
    artboardOrder: [...p.artboardOrder, artboard.id],
  };
}

export function updateArtboard(
  p: Project,
  id: ID,
  patch: Partial<Omit<Artboard, "id" | "childOrder">>,
): Project {
  const a = p.artboards[id];
  if (!a) return p;
  const next = { ...a, ...patch };
  for (const k of ["x", "y", "width", "height"] as const) next[k] = Math.round(next[k]);
  next.width = Math.max(1, next.width);
  next.height = Math.max(1, next.height);
  return { ...p, artboards: { ...p.artboards, [id]: next } };
}

export function removeArtboard(p: Project, id: ID): Project {
  const a = p.artboards[id];
  if (!a) return p;
  const artboards = { ...p.artboards };
  delete artboards[id];
  const nodes = { ...p.nodes };
  for (const nid of a.childOrder) delete nodes[nid];
  return { ...p, artboards, nodes, artboardOrder: p.artboardOrder.filter((x) => x !== id) };
}

function roundNode(n: Node): Node {
  return {
    ...n,
    x: Math.round(n.x),
    y: Math.round(n.y),
    w: Math.max(1, Math.round(n.w)),
    h: Math.max(1, Math.round(n.h)),
  };
}

export function addNodes(p: Project, nodes: Node[]): Project {
  const added = nodes.filter((n) => p.artboards[n.artboardId]);
  if (!added.length) return p;
  const allNodes = { ...p.nodes };
  const artboards = { ...p.artboards };
  for (const n of added) {
    allNodes[n.id] = roundNode(n);
    const a = artboards[n.artboardId];
    artboards[n.artboardId] = { ...a, childOrder: [...a.childOrder, n.id] };
  }
  return { ...p, nodes: allNodes, artboards };
}

type NodePatch = Partial<Omit<Node, "id" | "type" | "artboardId" | "props" | "style">>;

export function updateNodes(p: Project, ids: ID[], patch: NodePatch): Project {
  const nodes = { ...p.nodes };
  let changed = false;
  for (const id of ids) {
    const n = nodes[id];
    if (!n) continue;
    nodes[id] = roundNode({ ...n, ...patch });
    changed = true;
  }
  return changed ? { ...p, nodes } : p;
}

export function updateNode(p: Project, id: ID, patch: NodePatch): Project {
  return updateNodes(p, [id], patch);
}

export function updateNodeProps(p: Project, id: ID, props: Record<string, unknown>): Project {
  const n = p.nodes[id];
  if (!n) return p;
  return { ...p, nodes: { ...p.nodes, [id]: { ...n, props: { ...n.props, ...props } } } };
}

export function updateNodeStyle(p: Project, ids: ID[], style: NodeStyle): Project {
  const nodes = { ...p.nodes };
  for (const id of ids) {
    const n = nodes[id];
    if (!n) continue;
    const next: NodeStyle = { ...n.style, ...style };
    for (const k of Object.keys(next) as (keyof NodeStyle)[]) if (next[k] === undefined) delete next[k];
    nodes[id] = { ...n, style: next };
  }
  return { ...p, nodes };
}

export function moveNodes(p: Project, ids: ID[], dx: number, dy: number): Project {
  if (!dx && !dy) return p;
  const nodes = { ...p.nodes };
  for (const id of ids) {
    const n = nodes[id];
    if (!n || n.locked) continue;
    nodes[id] = roundNode({ ...n, x: n.x + dx, y: n.y + dy });
  }
  return { ...p, nodes };
}

export function setNodeRects(p: Project, rects: Record<ID, Rect>): Project {
  const nodes = { ...p.nodes };
  for (const [id, r] of Object.entries(rects)) {
    const n = nodes[id];
    if (!n || n.locked) continue;
    nodes[id] = roundNode({ ...n, ...r });
  }
  return { ...p, nodes };
}

export function removeNodes(p: Project, ids: ID[]): Project {
  const set = new Set(ids.filter((id) => p.nodes[id]));
  if (!set.size) return p;
  const nodes = { ...p.nodes };
  const artboards = { ...p.artboards };
  for (const id of set) {
    const n = nodes[id];
    delete nodes[id];
    const a = artboards[n.artboardId];
    if (a) artboards[n.artboardId] = { ...a, childOrder: a.childOrder.filter((x) => !set.has(x)) };
  }
  return dissolveSingletonGroups({ ...p, nodes, artboards });
}

function dissolveSingletonGroups(p: Project): Project {
  const counts = new Map<ID, ID[]>();
  for (const n of Object.values(p.nodes)) if (n.parentId) counts.set(n.parentId, [...(counts.get(n.parentId) ?? []), n.id]);
  const lonely = [...counts.values()].filter((ids) => ids.length < 2).flat();
  if (!lonely.length) return p;
  const nodes = { ...p.nodes };
  for (const id of lonely) {
    const n = { ...nodes[id] };
    delete n.parentId;
    nodes[id] = n;
  }
  return { ...p, nodes };
}

export function groupMembers(p: Project, ids: ID[]): ID[] {
  const groups = new Set(ids.map((id) => p.nodes[id]?.parentId).filter((g): g is ID => Boolean(g)));
  const out = new Set(ids.filter((id) => p.nodes[id]));
  if (groups.size) for (const n of Object.values(p.nodes)) if (n.parentId && groups.has(n.parentId)) out.add(n.id);
  return [...out];
}

export function groupNodes(p: Project, ids: ID[], groupId: ID): Project {
  const first = p.nodes[ids[0]];
  if (!first) return p;
  const a = p.artboards[first.artboardId];
  const members = new Set(groupMembers(p, ids).filter((id) => p.nodes[id].artboardId === a.id));
  if (members.size < 2) return p;
  const nodes = { ...p.nodes };
  for (const id of members) nodes[id] = { ...nodes[id], parentId: groupId };
  const top = Math.max(...[...members].map((id) => a.childOrder.indexOf(id)));
  const ordered = a.childOrder.filter((id) => members.has(id));
  const before = a.childOrder.slice(0, top + 1).filter((id) => !members.has(id));
  const after = a.childOrder.slice(top + 1);
  const childOrder = [...before, ...ordered, ...after];
  return dissolveSingletonGroups({ ...p, nodes, artboards: { ...p.artboards, [a.id]: { ...a, childOrder } } });
}

export function ungroupNodes(p: Project, ids: ID[]): Project {
  const groups = new Set(ids.map((id) => p.nodes[id]?.parentId).filter((g): g is ID => Boolean(g)));
  if (!groups.size) return p;
  const nodes = { ...p.nodes };
  for (const n of Object.values(p.nodes)) {
    if (n.parentId && groups.has(n.parentId)) {
      const c = { ...n };
      delete c.parentId;
      nodes[n.id] = c;
    }
  }
  return { ...p, nodes };
}

export function cloneNodesInto(
  p: Project,
  source: Node[],
  artboardId: ID,
  genId: IdGen,
  offset = 0,
): { project: Project; ids: ID[] } {
  if (!p.artboards[artboardId]) return { project: p, ids: [] };
  const groupMap = new Map<ID, ID>();
  const groupCounts = new Map<ID, number>();
  for (const n of source) if (n.parentId) groupCounts.set(n.parentId, (groupCounts.get(n.parentId) ?? 0) + 1);
  const clones = source.map((n) => {
    let parentId: ID | undefined;
    if (n.parentId && (groupCounts.get(n.parentId) ?? 0) > 1) {
      if (!groupMap.has(n.parentId)) groupMap.set(n.parentId, genId());
      parentId = groupMap.get(n.parentId);
    }
    const c: Node = { ...structuredClone(n), id: genId(), artboardId, x: n.x + offset, y: n.y + offset };
    if (parentId) c.parentId = parentId;
    else delete c.parentId;
    return c;
  });
  return { project: addNodes(p, clones), ids: clones.map((c) => c.id) };
}

export function orderedNodes(p: Project, ids: ID[]): Node[] {
  const set = new Set(ids);
  return p.artboardOrder.flatMap((aid) =>
    p.artboards[aid].childOrder.filter((id) => set.has(id)).map((id) => p.nodes[id]),
  );
}

export function duplicateNodes(
  p: Project,
  ids: ID[],
  genId: IdGen,
  offset = 16,
): { project: Project; ids: ID[] } {
  let project = p;
  const out: ID[] = [];
  for (const aid of p.artboardOrder) {
    const src = orderedNodes(p, ids).filter((n) => n.artboardId === aid);
    if (!src.length) continue;
    const r = cloneNodesInto(project, src, aid, genId, offset);
    project = r.project;
    out.push(...r.ids);
  }
  return { project, ids: out };
}

export function reorderList(order: ID[], selected: Set<ID>, dir: ZOrderDirection): ID[] {
  const list = [...order];
  if (dir === "front") return [...list.filter((x) => !selected.has(x)), ...list.filter((x) => selected.has(x))];
  if (dir === "back") return [...list.filter((x) => selected.has(x)), ...list.filter((x) => !selected.has(x))];
  if (dir === "forward") {
    for (let i = list.length - 2; i >= 0; i--) {
      if (selected.has(list[i]) && !selected.has(list[i + 1])) [list[i], list[i + 1]] = [list[i + 1], list[i]];
    }
  } else {
    for (let i = 1; i < list.length; i++) {
      if (selected.has(list[i]) && !selected.has(list[i - 1])) [list[i], list[i - 1]] = [list[i - 1], list[i]];
    }
  }
  return list;
}

export function reorderNodes(p: Project, ids: ID[], dir: ZOrderDirection): Project {
  const selected = new Set(ids);
  const artboards = { ...p.artboards };
  for (const aid of p.artboardOrder) {
    const a = artboards[aid];
    if (!a.childOrder.some((id) => selected.has(id))) continue;
    artboards[aid] = { ...a, childOrder: reorderList(a.childOrder, selected, dir) };
  }
  return { ...p, artboards };
}

export function moveNodeToIndex(p: Project, id: ID, index: number): Project {
  const n = p.nodes[id];
  if (!n) return p;
  const a = p.artboards[n.artboardId];
  const order = a.childOrder.filter((x) => x !== id);
  const i = Math.max(0, Math.min(order.length, index));
  order.splice(i, 0, id);
  return { ...p, artboards: { ...p.artboards, [a.id]: { ...a, childOrder: order } } };
}
