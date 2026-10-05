import { circle, line, measure, rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { ToastProps } from "./schema";

export const toastSvg: SvgDrawer<ToastProps> = (n, c) => {
  const p = n.props;
  const color = c.mode === "wireframe" ? c.t.text : { info: c.t.info, success: c.t.success, warning: c.t.warning, danger: c.t.danger }[p.variant];
  const actionW = p.actionLabel ? measure(p.actionLabel, 13, 600) + 16 : 0;
  const textW = n.w - 56 - actionW - 36;
  const cy = n.h / 2;
  return [
    rect(0, 0, n.w, n.h, { fill: c.t.surface, stroke: c.t.border, sw: c.t.borderWidth, r: c.radiusLg }),
    circle(26, cy, 9, { stroke: color, sw: 2 }),
    line(26, cy - 4, 26, cy + 1, color, 2),
    text(48, p.description ? cy - 9 : cy, truncate(p.title, textW, 14, 600), { size: 14, weight: 600, fill: c.t.text, family: c.family }),
    p.description ? text(48, cy + 10, truncate(p.description, textW, 13), { size: 13, fill: c.t.textMuted, family: c.family }) : "",
    p.actionLabel ? text(n.w - 36 - actionW / 2, cy, p.actionLabel, { size: 13, weight: 600, fill: c.mode === "wireframe" ? c.t.text : c.accent, anchor: "middle", family: c.family }) : "",
    text(n.w - 18, cy, "×", { size: 18, fill: c.t.textMuted, anchor: "middle", family: c.family }),
  ].join("");
};
