import { measure, paragraph, rect, text, truncate } from "../../../exporters/svg/primitives";
import { buttonShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { ModalProps } from "./schema";

export const modalSvg: SvgDrawer<ModalProps> = (n, c) => {
  const p = n.props;
  const bh = c.t.controlHSm;
  const parts = [
    rect(0, 0, n.w, n.h, { fill: c.t.surface, stroke: c.t.border, sw: c.t.borderWidth, r: c.radiusLg }),
    text(24, 32, truncate(p.title, n.w - 64, 18, c.t.headingWeight), { size: 18, weight: c.t.headingWeight, fill: c.t.text, family: c.family }),
    text(n.w - 28, 32, "×", { size: 20, fill: c.t.textMuted, anchor: "middle", family: c.family }),
    paragraph(24, 52, p.body, n.w - 48, n.h - 52 - bh - 32, { size: 14, fill: c.t.textMuted, family: c.family }),
  ];
  let right = n.w - 24;
  if (p.confirmLabel) {
    const w = measure(p.confirmLabel, 13, c.vars.buttonWeight) + 28;
    parts.push(buttonShape(right - w, n.h - 20 - bh, w, bh, p.confirmLabel, c, { size: 13 }));
    right -= w + 8;
  }
  if (p.cancelLabel) {
    const w = measure(p.cancelLabel, 13, c.vars.buttonWeight) + 28;
    parts.push(buttonShape(right - w, n.h - 20 - bh, w, bh, p.cancelLabel, c, { size: 13, variant: "outline" }));
  }
  return parts.join("");
};
