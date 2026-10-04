import { rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { BoxProps } from "./schema";

export const boxSvg: SvgDrawer<BoxProps> = (n, c) => {
  const p = n.props;
  const filled = p.variant === "filled";
  return (
    rect(0, 0, n.w, n.h, {
      fill: filled ? c.t.mutedBg : c.t.surface,
      stroke: filled ? undefined : c.t.border,
      sw: c.t.borderWidth,
      dash: p.variant === "dashed" ? "6 4" : undefined,
      r: c.radius,
    }) +
    text(n.w / 2, n.h / 2, p.label, {
      size: 14,
      fill: c.t.textMuted,
      anchor: "middle",
      family: c.family,
    })
  );
};
