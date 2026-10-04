import type { ID, Node, Rect } from "../document/types";
import { rectsIntersect } from "./rect";

export function nodesInRect(nodes: Node[], rect: Rect): ID[] {
  return nodes.filter((n) => !n.locked && !n.hidden && rectsIntersect(n, rect)).map((n) => n.id);
}

export function intersectRect(a: Rect, b: Rect): Rect | null {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  return x2 > x && y2 > y ? { x, y, w: x2 - x, h: y2 - y } : null;
}
