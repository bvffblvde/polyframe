import type { Rect } from "../document/types";
import { snapValue } from "./snap";

export const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
export type Handle = (typeof HANDLES)[number];

export interface ResizeOptions {
  keepAspect?: boolean;
  fromCenter?: boolean;
  minSize?: { w: number; h: number };
  snap?: number;
}

export function resizeRect(s: Rect, handle: Handle, dx: number, dy: number, o: ResizeOptions = {}): Rect {
  const hasW = handle.includes("w");
  const hasE = handle.includes("e");
  const hasN = handle.includes("n");
  const hasS = handle.includes("s");
  const k = o.fromCenter ? 2 : 1;
  const min = o.minSize ?? { w: 1, h: 1 };

  let w = s.w + (hasE ? dx : hasW ? -dx : 0) * k;
  let h = s.h + (hasS ? dy : hasN ? -dy : 0) * k;

  if (o.snap && !o.keepAspect && !o.fromCenter) {
    if (hasE) w = snapValue(s.x + w, o.snap) - s.x;
    if (hasW) w = s.x + s.w - snapValue(s.x + s.w - w, o.snap);
    if (hasS) h = snapValue(s.y + h, o.snap) - s.y;
    if (hasN) h = s.y + s.h - snapValue(s.y + s.h - h, o.snap);
  }

  if (o.keepAspect && s.h > 0 && s.w > 0) {
    const ratio = s.w / s.h;
    const horizontal = hasE || hasW;
    const vertical = hasN || hasS;
    if (horizontal && vertical) {
      if (Math.abs(w / s.w) >= Math.abs(h / s.h)) h = w / ratio;
      else w = h * ratio;
    } else if (horizontal) h = w / ratio;
    else w = h * ratio;
    if (w < min.w) {
      w = min.w;
      h = w / ratio;
    }
    if (h < min.h) {
      h = min.h;
      w = h * ratio;
    }
  }

  w = Math.round(Math.max(min.w, w));
  h = Math.round(Math.max(min.h, h));

  const x = o.fromCenter ? s.x + (s.w - w) / 2 : hasW ? s.x + s.w - w : s.x;
  const y = o.fromCenter ? s.y + (s.h - h) / 2 : hasN ? s.y + s.h - h : s.y;
  return { x: Math.round(x), y: Math.round(y), w, h };
}
