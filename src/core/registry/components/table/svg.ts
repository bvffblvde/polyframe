import { line, rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { TableProps } from "./schema";

export const tableSvg: SvgDrawer<TableProps> = (n, c) => {
  const p = n.props;
  const cols = Math.max(1, p.columns.length);
  const cw = n.w / cols;
  const rh = 37;
  const parts = [
    rect(0, 0, n.w, n.h, {
      fill: c.t.surface,
      stroke: c.t.border,
      sw: c.t.borderWidth,
      r: c.radius,
    }),
  ];
  if (c.vars.tableHeadBg !== "transparent")
    parts.push(rect(0, 0, n.w, rh, { fill: c.vars.tableHeadBg }));
  p.columns.forEach((col, i) =>
    parts.push(
      text(i * cw + 12, rh / 2, truncate(col, cw - 24, 14, 600), {
        size: 14,
        weight: 600,
        fill: c.t.text,
        family: c.family,
      }),
    ),
  );
  parts.push(line(0, rh, n.w, rh, c.t.border));
  p.rows.forEach((row, ri) => {
    const y = rh * (ri + 1);
    if (y + rh > n.h + 1) return;
    if (p.striped && ri % 2 === 1) parts.push(rect(0, y, n.w, rh, { fill: c.t.mutedBg }));
    p.columns.forEach((_, ci) =>
      parts.push(
        text(ci * cw + 12, y + rh / 2, truncate(row[ci] ?? "", cw - 24, 14), {
          size: 14,
          fill: c.t.text,
          family: c.family,
        }),
      ),
    );
    parts.push(line(0, y + rh, n.w, y + rh, c.t.border));
  });
  if (p.bordered)
    for (let i = 1; i < cols; i++) parts.push(line(i * cw, 0, i * cw, n.h, c.t.border));
  return parts.join("");
};
