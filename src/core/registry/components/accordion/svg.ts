import { line, paragraph, path, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { AccordionProps } from "./schema";

export const accordionSvg: SvgDrawer<AccordionProps> = (n, c) => {
  const p = n.props;
  const rowH = 48;
  let y = 0;
  const parts: string[] = [];
  p.items.forEach((item, i) => {
    const open = i === p.openIndex;
    parts.push(text(4, y + rowH / 2, truncate(item, n.w - 40, 14, 500), { size: 14, weight: 500, fill: c.t.text, family: c.family }));
    parts.push(path(open ? `M${n.w - 18} ${y + rowH / 2 + 2} l4 -4 l4 4` : `M${n.w - 18} ${y + rowH / 2 - 2} l4 4 l4 -4`, { stroke: c.t.textMuted, sw: 1.5 }));
    y += rowH;
    if (open && p.content) {
      parts.push(paragraph(4, y - 8, p.content, n.w - 8, 60, { size: 14, fill: c.t.textMuted, family: c.family }));
      y += 56;
    }
    parts.push(line(0, y, n.w, y, c.t.border, c.t.borderWidth));
  });
  return parts.join("");
};
