import { measure, path, rect, text } from "../../../exporters/svg/primitives";
import { buttonShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { DropzoneProps } from "./schema";

export const dropzoneSvg: SvgDrawer<DropzoneProps> = (n, c) => {
  const p = n.props;
  const cx = n.w / 2;
  const btnH = c.t.controlHSm;
  const block = 28 + 24 + (p.hint ? 20 : 0) + (p.actionLabel ? btnH + 12 : 0);
  let y = (n.h - block) / 2;
  const parts = [
    rect(1, 1, n.w - 2, n.h - 2, { fill: c.t.bg, stroke: c.t.border, sw: 2, dash: "8 6", r: c.radiusLg }),
    path(`M${cx} ${y + 22} V${y + 4} M${cx - 7} ${y + 11} L${cx} ${y + 4} L${cx + 7} ${y + 11} M${cx - 12} ${y + 22} V${y + 27} H${cx + 12} V${y + 22}`, { stroke: c.t.textMuted, sw: 2 }),
  ];
  y += 40;
  parts.push(text(cx, y, p.title, { size: 14, weight: 500, fill: c.t.text, anchor: "middle", family: c.family }));
  y += 20;
  if (p.hint) {
    parts.push(text(cx, y, p.hint, { size: 12, fill: c.t.textMuted, anchor: "middle", family: c.family }));
    y += 16;
  }
  if (p.actionLabel) {
    const w = measure(p.actionLabel, 13, c.vars.buttonWeight) + 28;
    parts.push(buttonShape(cx - w / 2, y + 4, w, btnH, p.actionLabel, c, { size: 13, variant: "outline" }));
  }
  return parts.join("");
};
