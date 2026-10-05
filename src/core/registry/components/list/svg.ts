import { circle, line, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { at, initialsOf } from "../../shared/text";
import type { ListProps } from "./schema";

export const listSvg: SvgDrawer<ListProps> = (n, c) => {
  const p = n.props;
  const rowH = 60;
  return p.items
    .map((item, i) => {
      const y = i * rowH;
      if (y + rowH > n.h + 1) return "";
      const x = p.showAvatar ? 64 : 12;
      const sub = at(p.secondary, i, "");
      return [
        p.showAvatar ? circle(32, y + rowH / 2, 20, { fill: c.mode === "wireframe" ? c.t.mutedBg : c.t.neutral, stroke: c.mode === "wireframe" ? c.t.border : undefined }) : "",
        p.showAvatar ? text(32, y + rowH / 2, initialsOf(item), { size: 14, weight: 600, fill: c.t.neutralFg, anchor: "middle", family: c.family }) : "",
        text(x, y + (sub ? rowH / 2 - 9 : rowH / 2), truncate(item, n.w - x - 12, 14, 500), { size: 14, weight: 500, fill: c.t.text, family: c.family }),
        sub ? text(x, y + rowH / 2 + 10, truncate(sub, n.w - x - 12, 13), { size: 13, fill: c.t.textMuted, family: c.family }) : "",
        p.dividers && i < p.items.length - 1 ? line(0, y + rowH, n.w, y + rowH, c.t.border) : "",
      ].join("");
    })
    .join("");
};
