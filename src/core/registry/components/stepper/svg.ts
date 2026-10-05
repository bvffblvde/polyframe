import { circle, line, measure, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { StepperProps } from "./schema";

export const stepperSvg: SvgDrawer<StepperProps> = (n, c) => {
  const steps = n.props.steps;
  const slot = n.w / Math.max(1, steps.length);
  const cy = n.h / 2;
  const wire = c.mode === "wireframe";
  return steps
    .map((step, i) => {
      const x = i * slot;
      const on = i <= n.props.activeIndex;
      const label = x + 40;
      const parts = [
        circle(x + 16, cy, 15, { fill: on ? (wire ? c.t.text : c.accent) : c.t.bg, stroke: on ? undefined : c.t.border, sw: c.t.borderWidth }),
        text(x + 16, cy, i < n.props.activeIndex ? "✓" : String(i + 1), { size: 13, weight: 600, fill: on ? (wire ? c.t.bg : c.accentFg) : c.t.textMuted, anchor: "middle", family: c.family }),
        text(label, cy, step, { size: 14, weight: i === n.props.activeIndex ? 600 : 400, fill: on ? c.t.text : c.t.textMuted, family: c.family }),
      ];
      const lineStart = label + measure(step, 14) + 8;
      if (i < steps.length - 1 && lineStart < x + slot - 8) parts.push(line(lineStart, cy, x + slot - 8, cy, i < n.props.activeIndex && !wire ? c.accent : c.t.border, 1.5));
      return parts.join("");
    })
    .join("");
};
