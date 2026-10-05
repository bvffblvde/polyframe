import type { Rect } from "../document/types";

export interface StackLayout {
  direction: "row" | "column";
  gap: number;
  padding: number;
  align: "start" | "center" | "end" | "stretch";
  justify: "start" | "center" | "end" | "between";
  hug: boolean;
}

export interface Size {
  w: number;
  h: number;
}

export function hugSize(layout: StackLayout, children: Size[]): Size {
  const row = layout.direction === "row";
  const main = children.reduce((s, c) => s + (row ? c.w : c.h), 0) + layout.gap * Math.max(0, children.length - 1);
  const cross = children.reduce((m, c) => Math.max(m, row ? c.h : c.w), 0);
  const w = (row ? main : cross) + layout.padding * 2;
  const h = (row ? cross : main) + layout.padding * 2;
  return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}

export function layoutStack(container: Rect, layout: StackLayout, children: Size[]): Rect[] {
  const row = layout.direction === "row";
  const p = layout.padding;
  const mainSize = (row ? container.w : container.h) - p * 2;
  const crossSize = (row ? container.h : container.w) - p * 2;
  const sizes = children.map((c) => (row ? c.w : c.h));
  const total = sizes.reduce((s, v) => s + v, 0);
  const n = children.length;
  let gap = layout.gap;
  let cursor = 0;
  const free = mainSize - total - gap * Math.max(0, n - 1);
  if (layout.justify === "between" && n > 1) gap = Math.max(0, (mainSize - total) / (n - 1));
  else if (layout.justify === "center") cursor = free / 2;
  else if (layout.justify === "end") cursor = free;
  return children.map((c, i) => {
    const mainLen = sizes[i];
    let crossLen = row ? c.h : c.w;
    let crossPos = 0;
    if (layout.align === "stretch") crossLen = crossSize;
    else if (layout.align === "center") crossPos = (crossSize - crossLen) / 2;
    else if (layout.align === "end") crossPos = crossSize - crossLen;
    const mainPos = cursor;
    cursor += mainLen + gap;
    const x = container.x + p + (row ? mainPos : crossPos);
    const y = container.y + p + (row ? crossPos : mainPos);
    return {
      x: Math.round(x),
      y: Math.round(y),
      w: Math.max(1, Math.round(row ? mainLen : crossLen)),
      h: Math.max(1, Math.round(row ? crossLen : mainLen)),
    };
  });
}
