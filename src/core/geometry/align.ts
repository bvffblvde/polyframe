import type { ID, Rect } from "../document/types";
import { boundsOf } from "./rect";

export const ALIGN_KINDS = ["left", "center", "right", "top", "middle", "bottom"] as const;
export type AlignKind = (typeof ALIGN_KINDS)[number];

export function alignRects(rects: Record<ID, Rect>, kind: AlignKind, container?: Rect): Record<ID, Rect> {
  const b = container ?? boundsOf(Object.values(rects));
  if (!b) return {};
  const out: Record<ID, Rect> = {};
  for (const [id, r] of Object.entries(rects)) {
    const n = { ...r };
    if (kind === "left") n.x = b.x;
    if (kind === "center") n.x = Math.round(b.x + (b.w - r.w) / 2);
    if (kind === "right") n.x = b.x + b.w - r.w;
    if (kind === "top") n.y = b.y;
    if (kind === "middle") n.y = Math.round(b.y + (b.h - r.h) / 2);
    if (kind === "bottom") n.y = b.y + b.h - r.h;
    out[id] = n;
  }
  return out;
}

export function distributeRects(rects: Record<ID, Rect>, axis: "x" | "y"): Record<ID, Rect> {
  const entries = Object.entries(rects);
  if (entries.length < 3) return { ...rects };
  const pos = axis === "x" ? "x" : "y";
  const size = axis === "x" ? "w" : "h";
  const sorted = [...entries].sort((a, b) => a[1][pos] - b[1][pos]);
  const first = sorted[0][1];
  const last = sorted[sorted.length - 1][1];
  const total = sorted.reduce((s, [, r]) => s + r[size], 0);
  const gap = (last[pos] + last[size] - first[pos] - total) / (sorted.length - 1);
  const out: Record<ID, Rect> = {};
  let cursor = first[pos];
  for (const [id, r] of sorted) {
    out[id] = { ...r, [pos]: Math.round(cursor) };
    cursor += r[size] + gap;
  }
  return out;
}
