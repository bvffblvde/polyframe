import { circle, rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { SliderProps } from "./schema";

export const sliderSvg: SvgDrawer<SliderProps> = (n, c) => {
  const p = n.props;
  const head = p.label || p.showValue;
  const ty = head ? n.h / 2 + 10 : n.h / 2;
  const fx = (n.w * Math.min(100, Math.max(0, p.value))) / 100;
  return (
    `<g${p.disabled ? ' opacity="0.5"' : ""}>` +
    (head
      ? text(0, ty - 22, p.label, { size: 14, weight: 500, fill: c.t.text, family: c.family })
      : "") +
    (p.showValue
      ? text(n.w, ty - 22, String(p.value), {
          size: 14,
          fill: c.t.textMuted,
          anchor: "end",
          family: c.family,
        })
      : "") +
    rect(0, ty - 2, n.w, 4, { fill: c.t.mutedBg, r: 2 }) +
    rect(0, ty - 2, fx, 4, { fill: c.accent, r: 2 }) +
    circle(fx, ty, 8, { fill: c.t.surface, stroke: c.accent, sw: 2 }) +
    "</g>"
  );
};
