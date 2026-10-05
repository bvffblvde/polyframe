import { rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { SegmentedProps } from "./schema";

export const segmentedSvg: SvgDrawer<SegmentedProps> = (n, c) => {
  const count = Math.max(1, n.props.options.length);
  const w = (n.w - 6) / count;
  const parts = [rect(0, 0, n.w, n.h, { fill: c.t.mutedBg, stroke: c.mode === "wireframe" ? c.t.border : undefined, r: c.radius })];
  n.props.options.forEach((o, i) => {
    const active = i === n.props.activeIndex;
    if (active) parts.push(rect(3 + i * w, 3, w, n.h - 6, { fill: c.t.surface, stroke: c.mode === "wireframe" ? c.t.border : undefined, r: Math.max(0, c.radius - 2) }));
    parts.push(text(3 + i * w + w / 2, n.h / 2, truncate(o, w - 8, 14), { size: 14, weight: active ? 500 : 400, fill: active ? c.t.text : c.t.textMuted, anchor: "middle", family: c.family }));
  });
  return parts.join("");
};
