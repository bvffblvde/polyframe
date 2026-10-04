import { circle, line, path, rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { ImageProps } from "./schema";

export const imageSvg: SvgDrawer<ImageProps> = (n, c) => {
  const p = n.props;
  const wire = c.mode === "wireframe";
  const r = p.rounded ? c.radiusLg : 0;
  const parts = [
    rect(0, 0, n.w, n.h, {
      fill: wire ? c.t.bg : c.t.mutedBg,
      stroke: wire ? c.t.border : undefined,
      sw: c.t.borderWidth,
      r,
    }),
  ];
  if (wire)
    parts.push(
      line(0, 0, n.w, n.h, c.t.border, c.t.borderWidth),
      line(n.w, 0, 0, n.h, c.t.border, c.t.borderWidth),
    );
  else {
    const cx = n.w / 2;
    const cy = n.h / 2;
    parts.push(
      rect(cx - 16, cy - 12, 32, 24, { stroke: c.t.textMuted, sw: 2, r: 3 }),
      circle(cx - 6, cy - 4, 2.5, { fill: c.t.textMuted }),
      path(`M${cx - 14} ${cy + 10} l9 -8 l6 5 l5 -4 l8 7`, { stroke: c.t.textMuted, sw: 2 }),
    );
  }
  if (p.caption)
    parts.push(text(12, n.h - 12, p.caption, { size: 12, fill: c.t.textMuted, family: c.family }));
  return parts.join("");
};
