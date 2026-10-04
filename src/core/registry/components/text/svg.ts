import { paragraph } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { TextProps } from "./schema";

export const textSvg: SvgDrawer<TextProps> = (n, c) => {
  const p = n.props;
  const size = { sm: c.t.fontSize * 0.875, md: c.t.fontSize, lg: c.t.fontSize * 1.125 }[p.size];
  const anchor = { left: "start", center: "middle", right: "end" }[p.align] as
    "start" | "middle" | "end";
  return paragraph(0, 0, p.text, n.w, n.h, {
    size,
    fill: p.muted ? c.t.textMuted : c.t.text,
    anchor,
    family: c.family,
  });
};
