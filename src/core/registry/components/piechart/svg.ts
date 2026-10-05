import { chartColors } from "../../../exporters/svg/charts";
import { path, rect, text, truncate } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { pieSlices } from "../../shared/chart";
import type { PiechartProps } from "./schema";

export const piechartSvg: SvgDrawer<PiechartProps> = (n, c) => {
  const p = n.props;
  const legendW = p.showLegend ? Math.min(160, n.w * 0.4) : 0;
  const size = Math.min(n.w - legendW, n.h) - 8;
  const r = size / 2;
  const colors = chartColors(c);
  const parts = pieSlices(r + 4, n.h / 2, r, p.donut ? r * 0.6 : 0, p.values).map((s) => path(s.path, { fill: colors[s.index % colors.length] }));
  if (p.showLegend) {
    const x = size + 24;
    const top = n.h / 2 - (p.labels.length * 22) / 2;
    p.labels.forEach((l, i) => {
      parts.push(rect(x, top + i * 22 + 6, 10, 10, { fill: colors[i % colors.length], r: 2 }));
      parts.push(text(x + 16, top + i * 22 + 11, truncate(l, legendW - 24, 12), { size: 12, fill: c.t.text, family: c.family }));
    });
  }
  return parts.join("");
};
