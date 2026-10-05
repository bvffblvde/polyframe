import { measure, path, rect, text } from "../../../exporters/svg/primitives";
import { buttonShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { TooltipProps } from "./schema";

export const tooltipSvg: SvgDrawer<TooltipProps> = (n, c) => {
  const p = n.props;
  const bw = Math.min(n.w, measure(p.text, 12) + 20);
  const bh = 26;
  const btnH = c.t.controlHSm;
  const top = p.placement === "top";
  const by = top ? 0 : n.h - bh;
  const btnY = top ? n.h - btnH : 0;
  const cx = n.w / 2;
  const fill = c.mode === "wireframe" ? c.t.text : "#18181b";
  const arrow = top ? `M${cx - 5} ${bh} L${cx} ${bh + 5} L${cx + 5} ${bh}Z` : `M${cx - 5} ${by} L${cx} ${by - 5} L${cx + 5} ${by}Z`;
  const tw = Math.min(n.w, measure(p.trigger, 13, c.vars.buttonWeight) + 24);
  return [
    rect(cx - bw / 2, by, bw, bh, { fill, r: 6 }),
    path(arrow, { fill }),
    text(cx, by + bh / 2, p.text, { size: 12, fill: "#ffffff", anchor: "middle", family: c.family }),
    p.trigger ? buttonShape(cx - tw / 2, btnY, tw, btnH, p.trigger, c, { size: 13, variant: "outline" }) : "",
  ].join("");
};
