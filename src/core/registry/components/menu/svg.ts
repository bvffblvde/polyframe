import { rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { MenuProps } from "./schema";

export const menuSvg: SvgDrawer<MenuProps> = (n, c) => {
  const p = n.props;
  const rowH = 36;
  const parts = [rect(0, 0, n.w, n.h, { fill: c.t.surface, stroke: c.t.border, sw: c.t.borderWidth, r: c.radius })];
  p.items.forEach((item, i) => {
    const y = 4 + i * rowH;
    if (y + rowH > n.h) return;
    if (i === p.activeIndex) parts.push(rect(4, y, n.w - 8, rowH, { fill: c.t.mutedBg, r: Math.max(0, c.radius - 2) }));
    const isDanger = p.destructiveLast && i === p.items.length - 1;
    parts.push(text(16, y + rowH / 2, truncate(item, n.w - 32, 14), { size: 14, fill: isDanger && c.mode === "styled" ? c.t.danger : c.t.text, family: c.family }));
  });
  return parts.join("");
};
