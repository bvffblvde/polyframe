import { ticks, type Box } from "../../registry/shared/chart";
import { line, rect, text, truncate } from "./primitives";
import type { SvgCtx } from "./types";

export function chartColors(c: SvgCtx): string[] {
  return [c.t.primary, c.t.info, c.t.success, c.t.warning, c.t.danger];
}

export function svgAxes(plot: Box, labels: string[], max: number, grid: boolean, c: SvgCtx, centered: boolean): string {
  const parts: string[] = [];
  for (const v of ticks(max)) {
    const y = plot.y + plot.h - (v / max) * plot.h;
    if (grid) parts.push(line(plot.x, y, plot.x + plot.w, y, c.t.border, 1, v ? "3 3" : undefined));
    parts.push(text(plot.x - 6, y, String(v), { size: 11, fill: c.t.textMuted, anchor: "end", family: c.family }));
  }
  const n = Math.max(1, labels.length);
  labels.forEach((l, i) => {
    const x = centered ? plot.x + (plot.w / n) * (i + 0.5) : plot.x + (n > 1 ? (plot.w / (n - 1)) * i : plot.w / 2);
    parts.push(text(x, plot.y + plot.h + 12, truncate(l, plot.w / n, 11), { size: 11, fill: c.t.textMuted, anchor: "middle", family: c.family }));
  });
  return parts.join("");
}

export function svgLegend(x: number, y: number, names: string[], c: SvgCtx): string {
  const colors = chartColors(c);
  let cx = x;
  return names
    .map((name, i) => {
      const out = rect(cx, y - 5, 10, 10, { fill: colors[i % colors.length], r: 2 }) + text(cx + 14, y, name, { size: 12, fill: c.t.text, family: c.family });
      cx += 14 + name.length * 6.5 + 16;
      return out;
    })
    .join("");
}
