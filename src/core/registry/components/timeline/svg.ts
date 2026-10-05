import { circle, line, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { at } from "../../shared/text";
import type { TimelineProps } from "./schema";

export const timelineSvg: SvgDrawer<TimelineProps> = (n, c) => {
  const p = n.props;
  const step = 56;
  const parts = [line(8, 8, 8, Math.min(n.h, step * Math.max(1, p.events.length)) - 8, c.t.border, 2)];
  p.events.forEach((e, i) => {
    const y = i * step + 8;
    if (y > n.h) return;
    const done = i <= p.activeIndex;
    parts.push(circle(8, y, 6, { fill: done ? (c.mode === "wireframe" ? c.t.text : c.accent) : c.t.bg, stroke: done ? undefined : c.t.border, sw: 2 }));
    parts.push(text(28, y, truncate(e, n.w - 32, 14, 500), { size: 14, weight: 500, fill: c.t.text, family: c.family }));
    const date = at(p.dates, i, "");
    if (date) parts.push(text(28, y + 20, date, { size: 13, fill: c.t.textMuted, family: c.family }));
  });
  return parts.join("");
};
