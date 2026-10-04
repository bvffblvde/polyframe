import { line, measure, paragraph, rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { TabsProps } from "./schema";

export const tabsSvg: SvgDrawer<TabsProps> = (n, c) => {
  const p = n.props;
  const style = c.structure.tabs;
  const parts: string[] = [];
  const th = 36;
  let x = style === "segmented" ? 3 : 0;
  const widths = p.tabs.map((t) => measure(t, 14, 500) + 32);
  if (style === "segmented")
    parts.push(
      rect(
        0,
        0,
        widths.reduce((a, b) => a + b, 6),
        th,
        { fill: c.t.mutedBg, r: c.radius },
      ),
    );
  else if (style === "underline") parts.push(line(0, th, n.w, th, c.t.border, c.t.borderWidth));
  p.tabs.forEach((t, i) => {
    const active = i === p.activeIndex;
    const w = widths[i];
    if (active && style === "segmented")
      parts.push(rect(x, 3, w, th - 6, { fill: c.t.surface, r: Math.max(0, c.radius - 2) }));
    if (active && style === "pills") parts.push(rect(x, 0, w, th, { fill: c.accent, r: c.radius }));
    if (active && style === "underline")
      parts.push(rect(x, th - 2, w, 2, { fill: c.mode === "wireframe" ? c.t.text : c.accent }));
    const color = active
      ? style === "pills"
        ? c.accentFg
        : style === "underline" && c.mode === "styled"
          ? c.accent
          : c.t.text
      : style === "pills"
        ? c.accent
        : c.t.textMuted;
    parts.push(
      text(x + w / 2, th / 2, t, {
        size: 14,
        weight: active ? 500 : 400,
        fill: color,
        anchor: "middle",
        family: c.family,
      }),
    );
    x += w;
  });
  if (p.content)
    parts.push(
      paragraph(4, th + 16, p.content, n.w - 8, n.h - th - 16, {
        size: 14,
        fill: c.t.text,
        family: c.family,
      }),
    );
  return parts.join("");
};
