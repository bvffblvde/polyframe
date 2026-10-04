import { circle, line, measure, rect, text } from "../../../exporters/svg/primitives";
import { buttonShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { NavbarProps } from "./schema";

export const navbarSvg: SvgDrawer<NavbarProps> = (n, c) => {
  const p = n.props;
  const fg = c.vars.navbarFg;
  const parts = [
    rect(0, 0, n.w, n.h, { fill: c.vars.navbarBg }),
    line(0, n.h, n.w, n.h, c.t.border, c.t.borderWidth),
  ];
  parts.push(text(24, n.h / 2, p.brand, { size: 18, weight: 700, fill: fg, family: c.family }));
  let x = 24 + measure(p.brand, 18, 700) + 24;
  p.links.forEach((l, i) => {
    parts.push(
      text(x, n.h / 2, l, { size: 14, weight: i === 0 ? 600 : 400, fill: fg, family: c.family }),
    );
    x += measure(l, 14) + 20;
  });
  let right = n.w - 24;
  if (p.showAvatar) {
    parts.push(circle(right - 16, n.h / 2, 16, { fill: c.t.neutral }));
    right -= 44;
  }
  if (p.actionLabel) {
    const bw = measure(p.actionLabel, 13, c.vars.buttonWeight) + 24;
    parts.push(
      buttonShape(right - bw, (n.h - c.t.controlHSm) / 2, bw, c.t.controlHSm, p.actionLabel, c, {
        size: 13,
      }),
    );
  }
  return parts.join("");
};
