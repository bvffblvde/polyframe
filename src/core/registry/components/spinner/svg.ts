import { circle, path, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { SpinnerProps } from "./schema";

export const spinnerSvg: SvgDrawer<SpinnerProps> = (n, c) => {
  const d = { sm: 16, md: 24, lg: 36 }[n.props.size];
  const r = d / 2 - 2;
  const cx = d / 2;
  const cy = n.h / 2;
  const color = c.mode === "wireframe" ? c.t.text : c.accent;
  return (
    circle(cx, cy, r, { stroke: c.t.mutedBg, sw: 3 }) +
    path(`M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx + r} ${cy}`, { stroke: color, sw: 3 }) +
    text(d + 10, cy, n.props.label, { size: 14, fill: c.t.textMuted, family: c.family })
  );
};
