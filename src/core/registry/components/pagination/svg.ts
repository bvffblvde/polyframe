import { rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { pageList } from "../../shared/pages";
import type { PaginationProps } from "./schema";

export const paginationSvg: SvgDrawer<PaginationProps> = (n, c) => {
  const size = Math.min(n.h, c.t.controlHSm);
  const y = (n.h - size) / 2;
  const items: (string | number)[] = ["‹", ...pageList(n.props.pages, n.props.current).map((p) => (p === "ellipsis" ? "…" : p)), "›"];
  return items
    .map((item, i) => {
      const x = i * (size + 4);
      const active = item === n.props.current;
      const fill = active ? (c.mode === "wireframe" ? c.t.mutedBg : c.accent) : undefined;
      return (
        (active || typeof item === "number" ? rect(x, y, size, size, { fill, stroke: active ? undefined : c.t.border, sw: c.t.borderWidth, r: c.radius }) : "") +
        text(x + size / 2, n.h / 2, String(item), { size: 14, fill: active && c.mode === "styled" ? c.accentFg : c.t.text, anchor: "middle", family: c.family })
      );
    })
    .join("");
};
