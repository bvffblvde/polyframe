import { line, measure, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { DividerProps } from "./schema";

export const dividerSvg: SvgDrawer<DividerProps> = (n, c) => {
  const p = n.props;
  if (p.orientation === "vertical")
    return line(n.w / 2, 0, n.w / 2, n.h, c.t.border, c.t.borderWidth);
  if (!p.label) return line(0, n.h / 2, n.w, n.h / 2, c.t.border, c.t.borderWidth);
  const lw = measure(p.label, 12) + 24;
  const side = (n.w - lw) / 2;
  return (
    line(0, n.h / 2, side, n.h / 2, c.t.border, c.t.borderWidth) +
    text(n.w / 2, n.h / 2, p.label, {
      size: 12,
      fill: c.t.textMuted,
      anchor: "middle",
      family: c.family,
    }) +
    line(n.w - side, n.h / 2, n.w, n.h / 2, c.t.border, c.t.borderWidth)
  );
};
