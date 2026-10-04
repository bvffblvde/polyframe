import { circle, rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { SwitchProps } from "./schema";

export const switchSvg: SvgDrawer<SwitchProps> = (n, c) => {
  const p = n.props;
  const cy = n.h / 2;
  const on = p.checked;
  const material = c.structure.switch === "material";
  const track = material
    ? rect(3, cy - 7, 34, 14, { fill: on ? c.accent : "#000000", opacity: on ? 0.5 : 0.38, r: 7 })
    : rect(0, cy - 10, 36, 20, {
        fill: on ? c.accent : c.t.mutedBg,
        stroke: on ? c.accent : c.t.border,
        sw: c.t.borderWidth,
        r: 10,
      });
  const thumb = material
    ? circle(on ? 30 : 10, cy, 10, { fill: on ? c.accent : "#ffffff", stroke: "#00000022" })
    : circle(on ? 26 : 10, cy, 8, { fill: "#ffffff" });
  return `<g${p.disabled ? ' opacity="0.5"' : ""}>${track}${thumb}${text(material ? 50 : 44, cy, p.label, { size: 14, fill: c.t.text, family: c.family })}</g>`;
};
