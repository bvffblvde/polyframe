import type { Node, Rect } from "../document/types";
import { boundsOf, rectsIntersect } from "./rect";
import type { Viewport } from "./viewport";

export const CULL_MIN_NODES = 200;
export const CULL_TILE = 512;

export function cullWindow(
  vp: Viewport,
  view: { width: number; height: number },
  tile = CULL_TILE,
): Rect {
  const w = view.width / vp.zoom;
  const h = view.height / vp.zoom;
  const x0 = Math.floor((-vp.x / vp.zoom - w / 2) / tile) * tile;
  const y0 = Math.floor((-vp.y / vp.zoom - h / 2) / tile) * tile;
  const x1 = Math.ceil((-vp.x / vp.zoom + w * 1.5) / tile) * tile;
  const y1 = Math.ceil((-vp.y / vp.zoom + h * 1.5) / tile) * tile;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export function sameRect(a: Rect | null, b: Rect | null): boolean {
  return a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);
}

export function nextCullRect(
  current: Rect | null,
  target: Rect | null,
): { now: Rect | null; settle: boolean } {
  if (!current || !target) return { now: target, settle: false };
  const now = boundsOf([current, target]);
  return { now, settle: !sameRect(now, target) };
}

export function visibleNodeIds(
  order: string[],
  nodes: Record<string, Node>,
  artboard: { x: number; y: number; width: number; height: number },
  win: Rect | null,
): string[] {
  if (!win || order.length < CULL_MIN_NODES) return order;
  const local = { ...win, x: win.x - artboard.x, y: win.y - artboard.y };
  if (
    local.x <= 0 &&
    local.y <= 0 &&
    local.x + local.w >= artboard.width &&
    local.y + local.h >= artboard.height
  )
    return order;
  return order.filter((id) => nodes[id] && rectsIntersect(nodes[id], local));
}
