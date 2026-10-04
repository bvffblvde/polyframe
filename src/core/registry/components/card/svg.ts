import { measure, paragraph, rect, text, truncate } from "../../../exporters/svg/primitives";
import { buttonShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { CardProps } from "./schema";

export const cardSvg: SvgDrawer<CardProps> = (n, c) => {
  const p = n.props;
  const parts = [
    rect(0, 0, n.w, n.h, {
      fill: c.t.surface,
      stroke: c.t.border,
      sw: c.t.borderWidth,
      r: c.radiusLg,
    }),
  ];
  let y = 20;
  if (p.title) {
    parts.push(
      text(20, y + 11, truncate(p.title, n.w - 40, 18, c.t.headingWeight), {
        size: 18,
        fill: c.t.text,
        weight: c.t.headingWeight,
        family: c.family,
      }),
    );
    y += 32;
  }
  if (p.body)
    parts.push(
      paragraph(20, y, p.body, n.w - 40, n.h - y - (p.showFooter ? 60 : 20), {
        size: 14,
        fill: c.t.textMuted,
        family: c.family,
      }),
    );
  if (p.showFooter) {
    const bw = Math.min(n.w - 40, measure(p.actionLabel, 13, c.vars.buttonWeight) + 24);
    parts.push(
      buttonShape(n.w - 20 - bw, n.h - 20 - c.t.controlHSm, bw, c.t.controlHSm, p.actionLabel, c, {
        size: 13,
      }),
    );
  }
  return parts.join("");
};
