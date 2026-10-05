import { circle, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { AvatargroupProps } from "./schema";

export const avatargroupSvg: SvgDrawer<AvatargroupProps> = (n, c) => {
  const d = n.h;
  const shown = n.props.initials.slice(0, n.props.max);
  const rest = n.props.initials.length - shown.length;
  const labels = rest > 0 ? [...shown, `+${rest}`] : shown;
  const wire = c.mode === "wireframe";
  return labels
    .map((l, i) => {
      const cx = d / 2 + i * d * 0.75;
      return (
        circle(cx, d / 2, d / 2 - 1, { fill: wire ? c.t.mutedBg : c.t.neutral, stroke: c.t.bg, sw: 2 }) +
        text(cx, d / 2, l, { size: d * 0.36, weight: 600, fill: c.t.neutralFg, anchor: "middle", family: c.family })
      );
    })
    .join("");
};
