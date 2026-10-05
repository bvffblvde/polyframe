import { rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { StatProps } from "./schema";

export const statSvg: SvgDrawer<StatProps> = (n, c) => {
  const p = n.props;
  const color = c.mode === "wireframe" ? c.t.text : p.trend === "up" ? c.t.success : c.t.danger;
  return [
    rect(0, 0, n.w, n.h, { fill: c.t.surface, stroke: c.t.border, sw: c.t.borderWidth, r: c.radiusLg }),
    text(16, 24, truncate(p.label, n.w - 32, 13), { size: 13, fill: c.t.textMuted, family: c.family }),
    text(16, 56, truncate(p.value, n.w - 32, 28, 700), { size: 28, weight: 700, fill: c.t.text, family: c.family }),
    p.delta ? text(16, 86, `${p.trend === "up" ? "▲" : "▼"} ${p.delta}`, { size: 13, weight: 500, fill: color, family: c.family }) : "",
  ].join("");
};
