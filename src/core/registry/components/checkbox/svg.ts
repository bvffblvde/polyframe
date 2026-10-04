import { path, rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { CheckboxProps } from "./schema";

export const checkboxSvg: SvgDrawer<CheckboxProps> = (n, c) => {
  const p = n.props;
  const y = n.h / 2 - 8;
  const fill = p.checked ? c.accent : c.t.bg;
  return (
    `<g${p.disabled ? ' opacity="0.5"' : ""}>` +
    rect(0, y, 16, 16, {
      fill,
      stroke: p.checked ? c.accent : c.t.textMuted,
      sw: c.t.borderWidth,
      r: 3,
    }) +
    (p.checked ? path(`M4 ${y + 8} l3 3 l5 -6`, { stroke: c.accentFg, sw: 2 }) : "") +
    text(24, n.h / 2, p.label, { size: 14, fill: c.t.text, family: c.family }) +
    "</g>"
  );
};
