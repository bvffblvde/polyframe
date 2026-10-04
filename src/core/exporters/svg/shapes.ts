import { line, measure, path, rect, text, truncate } from "./primitives";
import type { SvgCtx } from "./types";

export function buttonShape(
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  ctx: SvgCtx,
  opts: { variant?: "solid" | "outline" | "ghost"; size?: number; disabled?: boolean } = {},
): string {
  const variant = opts.variant ?? "solid";
  const wire = ctx.mode === "wireframe";
  const size = opts.size ?? 14;
  const upper = ctx.vars.buttonTransform === "uppercase";
  const value = truncate(upper ? label.toUpperCase() : label, w - 16, size, ctx.vars.buttonWeight);
  let fill: string | undefined;
  let stroke: string | undefined;
  let color = ctx.accent;
  if (variant === "solid") {
    fill = wire ? ctx.t.mutedBg : ctx.accent;
    stroke = wire ? ctx.t.border : ctx.accent;
    color = wire ? ctx.t.text : ctx.accentFg;
  } else if (variant === "outline") stroke = ctx.accent;
  const op = opts.disabled ? 0.5 : 1;
  return (
    `<g${op < 1 ? ` opacity="${op}"` : ""}>` +
    rect(x, y, w, h, { fill, stroke, sw: ctx.t.borderWidth, r: ctx.radius }) +
    text(x + w / 2, y + h / 2, value, { size, fill: color, weight: ctx.vars.buttonWeight, anchor: "middle", family: ctx.family }) +
    "</g>"
  );
}

export function fieldShape(
  w: number,
  h: number,
  ctx: SvgCtx,
  o: { label: string; value: string; placeholder: string; helper?: string; invalid?: boolean; disabled?: boolean; multiline?: boolean; chevron?: boolean },
): string {
  const floating = ctx.structure.inputLabel === "floating";
  const controlH = o.multiline ? h - (o.label && !floating ? 26 : 0) : ctx.t.controlH;
  const top = o.label && !floating ? 26 : floating ? 8 : 0;
  const border = o.invalid ? ctx.t.danger : ctx.t.border;
  const parts = [
    o.label && !floating ? text(0, 9, o.label, { size: 14, fill: ctx.t.text, weight: 500, family: ctx.family }) : "",
    rect(0, top, w, Math.max(16, controlH - (floating ? 8 : 0)), {
      fill: o.disabled ? ctx.t.mutedBg : ctx.t.bg,
      stroke: border,
      sw: ctx.t.borderWidth,
      r: ctx.radius,
    }),
  ];
  if (floating && o.label) {
    const lw = measure(o.label, 12) + 8;
    parts.push(rect(8, top - 7, lw, 14, { fill: ctx.t.bg }), text(12, top, o.label, { size: 12, fill: ctx.t.textMuted, family: ctx.family }));
  }
  const shown = o.value || o.placeholder;
  const ty = o.multiline ? top + 18 : top + (controlH - (floating ? 8 : 0)) / 2;
  parts.push(text(12, ty, truncate(shown, w - (o.chevron ? 40 : 24), 14), { size: 14, fill: o.value ? ctx.t.text : ctx.t.textMuted, family: ctx.family }));
  if (o.chevron) {
    const cy = top + (controlH - (floating ? 8 : 0)) / 2;
    parts.push(path(`M${w - 22} ${cy - 2} l4 4 l4 -4`, { stroke: ctx.t.textMuted, sw: 1.5 }));
  }
  if (o.helper) {
    parts.push(text(0, top + controlH + 10, o.helper, { size: 12, fill: o.invalid ? ctx.t.danger : ctx.t.textMuted, family: ctx.family }));
  }
  return parts.join("");
}

export { line };
