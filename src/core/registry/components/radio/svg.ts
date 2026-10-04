import { circle, measure, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { RadioProps } from "./schema";

export const radioSvg: SvgDrawer<RadioProps> = (n, c) => {
  const p = n.props;
  const parts: string[] = [];
  let y = 0;
  if (p.label) {
    parts.push(text(0, 9, p.label, { size: 14, weight: 500, fill: c.t.text, family: c.family }));
    y = 26;
  }
  let x = 0;
  p.options.forEach((o, i) => {
    const cy = y + 8;
    const checked = i === p.activeIndex;
    parts.push(
      circle(x + 8, cy, 7.5, {
        fill: c.t.bg,
        stroke: checked ? c.accent : c.t.textMuted,
        sw: c.t.borderWidth,
      }),
    );
    if (checked) parts.push(circle(x + 8, cy, 4, { fill: c.accent }));
    parts.push(text(x + 24, cy, o, { size: 14, fill: c.t.text, family: c.family }));
    if (p.orientation === "horizontal") x += measure(o, 14) + 48;
    else y += 24;
  });
  return `<g${p.disabled ? ' opacity="0.5"' : ""}>${parts.join("")}</g>`;
};
