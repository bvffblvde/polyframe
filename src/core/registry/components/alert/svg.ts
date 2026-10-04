import { circle, line, paragraph, rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { AlertProps } from "./schema";

export const alertSvg: SvgDrawer<AlertProps> = (n, c) => {
  const p = n.props;
  const color = { info: c.t.info, success: c.t.success, warning: c.t.warning, danger: c.t.danger }[
    p.variant
  ];
  const wire = c.mode === "wireframe";
  const parts = [
    rect(0, 0, n.w, n.h, { fill: wire ? c.t.bg : color, opacity: wire ? 1 : 0.1, r: c.radius }),
    rect(0.5, 0.5, n.w - 1, n.h - 1, {
      stroke: wire ? c.t.border : color,
      sw: wire ? c.t.borderWidth : 1,
      r: c.radius,
    }),
    circle(26, 22, 9, { stroke: color, sw: 2 }),
    line(26, 18, 26, 23, color, 2),
    circle(26, 27, 1, { fill: color }),
  ];
  let y = 12;
  if (p.title) {
    parts.push(
      text(48, y + 10, truncate(p.title, n.w - 64, 14, 600), {
        size: 14,
        weight: 600,
        fill: c.t.text,
        family: c.family,
      }),
    );
    y += 22;
  }
  if (p.description)
    parts.push(
      paragraph(48, y, p.description, n.w - 64, n.h - y - 8, {
        size: 14,
        fill: c.t.textMuted,
        family: c.family,
      }),
    );
  return parts.join("");
};
