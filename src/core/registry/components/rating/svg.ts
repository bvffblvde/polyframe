import { path } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { RatingProps } from "./schema";

const STAR = "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z";

export const ratingSvg: SvgDrawer<RatingProps> = (n, c) => {
  const size = Math.min(n.h, n.w / Math.max(1, n.props.count) - 4);
  const k = size / 24;
  return Array.from({ length: n.props.count }, (_, i) => {
    const on = i < Math.round(n.props.value);
    const color = c.mode === "wireframe" ? c.t.text : c.t.warning;
    return `<g transform="translate(${i * (size + 4)} ${(n.h - size) / 2}) scale(${k})">${path(STAR, { fill: on ? color : undefined, stroke: on ? color : c.t.border, sw: 1.5 })}</g>`;
  }).join("");
};
