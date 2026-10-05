import { circle, rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { monthGrid, monthTitle, weekdayNames } from "../../shared/calendar";
import type { CalendarProps } from "./schema";

export const calendarSvg: SvgDrawer<CalendarProps> = (n, c) => {
  const p = n.props;
  const cells = monthGrid(p.year, p.month, p.weekStart);
  const rows = cells.length / 7;
  const cw = (n.w - 24) / 7;
  const ch = Math.min(cw, (n.h - 84) / rows);
  const parts = [
    rect(0, 0, n.w, n.h, { fill: c.t.surface, stroke: c.t.border, sw: c.t.borderWidth, r: c.radiusLg }),
    text(20, 24, "‹", { size: 16, fill: c.t.textMuted, family: c.family }),
    text(n.w / 2, 24, monthTitle(p.locale, p.year, p.month), { size: 14, weight: 600, fill: c.t.text, anchor: "middle", family: c.family }),
    text(n.w - 20, 24, "›", { size: 16, fill: c.t.textMuted, anchor: "end", family: c.family }),
  ];
  weekdayNames(p.locale, p.weekStart).forEach((d, i) => parts.push(text(12 + cw * i + cw / 2, 56, d, { size: 11, fill: c.t.textMuted, anchor: "middle", family: c.family })));
  cells.forEach((cell, i) => {
    const cx = 12 + cw * (i % 7) + cw / 2;
    const cy = 76 + ch * Math.floor(i / 7) + ch / 2;
    const sel = cell.inMonth && cell.day === p.selected;
    if (sel) parts.push(circle(cx, cy, Math.min(cw, ch) / 2 - 2, { fill: c.mode === "wireframe" ? c.t.text : c.accent }));
    parts.push(text(cx, cy, String(cell.day), { size: 13, fill: sel ? (c.mode === "wireframe" ? c.t.bg : c.accentFg) : cell.inMonth ? c.t.text : c.t.textMuted, anchor: "middle", family: c.family }));
  });
  return parts.join("");
};
