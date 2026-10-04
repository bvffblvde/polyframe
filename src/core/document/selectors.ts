import type { ID, Node, Project } from "./types";

export function artboardNodes(p: Project, artboardId: ID): Node[] {
  const a = p.artboards[artboardId];
  return a ? a.childOrder.map((id) => p.nodes[id]).filter(Boolean) : [];
}

export function nodeArtboardId(p: Project, id: ID): ID | undefined {
  return p.nodes[id]?.artboardId;
}

export function existingIds(p: Project, ids: ID[]): ID[] {
  return ids.filter((id) => p.nodes[id]);
}
