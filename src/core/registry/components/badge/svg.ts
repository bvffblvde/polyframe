import { rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { BadgeProps } from "./schema";

export const badgeSvg: SvgDrawer<BadgeProps> = (n, c) => {
  const p = n.props;
  const wire = c.mode === "wireframe";
  const r = c.vars.badgeRadius === "999px" ? n.h / 2 : parseFloat(c.vars.badgeRadius) || 4;
  const fill = wire
    ? c.t.mutedBg
    : p.variant === "solid"
      ? c.accent
      : p.variant === "soft"
        ? c.accent
        : undefined;
  const color = wire ? c.t.text : p.variant === "solid" ? c.accentFg : c.accent;
  return (
    rect(0, 0, n.w, n.h, {
      fill,
      opacity: !wire && p.variant === "soft" ? 0.14 : 1,
      stroke: wire ? c.t.border : p.variant === "outline" ? c.accent : undefined,
      r,
    }) +
    text(n.w / 2, n.h / 2, truncate(p.text, n.w - 8, 12, 600), {
      size: 12,
      weight: 600,
      fill: color,
      anchor: "middle",
      family: c.family,
    })
  );
};
