import { line, rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { SidebarProps } from "./schema";

export const sidebarSvg: SvgDrawer<SidebarProps> = (n, c) => {
  const p = n.props;
  const parts = [
    rect(0, 0, n.w, n.h, { fill: c.t.mutedBg }),
    line(n.w, 0, n.w, n.h, c.t.border, c.t.borderWidth),
  ];
  let y = 12;
  if (p.title) {
    parts.push(
      text(24, y + 16, p.title.toUpperCase(), {
        size: 12,
        weight: 600,
        fill: c.t.textMuted,
        family: c.family,
      }),
    );
    y += 36;
  }
  p.items.forEach((item, i) => {
    const active = i === p.activeIndex;
    if (active)
      parts.push(
        rect(12, y, n.w - 24, 36, {
          fill: c.mode === "wireframe" ? c.t.neutral : c.accent,
          opacity: c.mode === "wireframe" ? 1 : 0.12,
          r: c.radius,
        }),
      );
    parts.push(
      text(24, y + 18, truncate(item, n.w - 48, 14), {
        size: 14,
        weight: active ? 600 : 400,
        fill: active && c.mode === "styled" ? c.accent : c.t.text,
        family: c.family,
      }),
    );
    y += 38;
  });
  return parts.join("");
};
