import { circle, rect } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { SkeletonProps } from "./schema";

export const skeletonSvg: SvgDrawer<SkeletonProps> = (n, c) => {
  const p = n.props;
  const x = p.showAvatar ? 64 : 0;
  const lh = 12;
  const gap = 8;
  const total = p.lines * lh + (p.lines - 1) * gap;
  const top = (n.h - total) / 2;
  return [
    p.showAvatar ? circle(24, n.h / 2, 24, { fill: c.t.mutedBg }) : "",
    ...Array.from({ length: p.lines }, (_, i) =>
      rect(x, top + i * (lh + gap), (n.w - x) * (i === p.lines - 1 && p.lines > 1 ? 0.75 : 1), lh, { fill: c.t.mutedBg, r: 6 }),
    ),
  ].join("");
};
