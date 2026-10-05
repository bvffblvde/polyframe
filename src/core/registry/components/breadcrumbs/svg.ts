import { measure, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { BreadcrumbsProps } from "./schema";

export const breadcrumbsSvg: SvgDrawer<BreadcrumbsProps> = (n, c) => {
  let x = 0;
  const parts: string[] = [];
  n.props.items.forEach((item, i) => {
    if (i > 0) {
      parts.push(text(x, n.h / 2, n.props.separator === "slash" ? "/" : "›", { size: 14, fill: c.t.textMuted, family: c.family }));
      x += 18;
    }
    const current = i === n.props.items.length - 1;
    parts.push(text(x, n.h / 2, item, { size: 14, fill: current ? c.t.text : c.mode === "wireframe" ? c.t.textMuted : c.accent, family: c.family }));
    x += measure(item, 14) + 10;
  });
  return parts.join("");
};
