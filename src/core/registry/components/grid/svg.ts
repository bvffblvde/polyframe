import { rect } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { GridProps } from "./schema";

export const gridSvg: SvgDrawer<GridProps> = (n, c) => {
  if (n.props.background === "none") return "";
  const surface = n.props.background === "surface";
  return rect(0, 0, n.w, n.h, { fill: surface ? c.t.surface : c.t.mutedBg, stroke: surface ? c.t.border : undefined, sw: c.t.borderWidth, r: c.radiusLg });
};
