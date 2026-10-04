import { rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { ProgressProps } from "./schema";

export const progressSvg: SvgDrawer<ProgressProps> = (n, c) => {
  const p = n.props;
  const head = p.label || p.showValue;
  const ty = head ? n.h / 2 + 10 : n.h / 2;
  const pct = Math.min(100, Math.max(0, p.value));
  return (
    (head
      ? text(0, ty - 22, p.label, { size: 14, weight: 500, fill: c.t.text, family: c.family })
      : "") +
    (p.showValue
      ? text(n.w, ty - 22, `${pct}%`, {
          size: 14,
          fill: c.t.textMuted,
          anchor: "end",
          family: c.family,
        })
      : "") +
    rect(0, ty - 4, n.w, 8, {
      fill: c.t.mutedBg,
      stroke: c.mode === "wireframe" ? c.t.border : undefined,
      r: 4,
    }) +
    rect(0, ty - 4, (n.w * pct) / 100, 8, { fill: c.accent, r: 4 })
  );
};
