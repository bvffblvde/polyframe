import { chartColors, svgAxes, svgLegend } from "../../../exporters/svg/charts";
import { rect } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { barRects, plotArea, seriesMax } from "../../shared/chart";
import { chartSeries, type BarchartProps } from "./schema";

export const barchartSvg: SvgDrawer<BarchartProps> = (n, c) => {
  const p = n.props;
  const series = chartSeries(p);
  const plot = plotArea(n.w, n.h, p.showLegend);
  const max = seriesMax(series);
  const colors = chartColors(c);
  return [
    p.showLegend ? svgLegend(plot.x, 12, p.series.slice(0, series.length), c) : "",
    svgAxes(plot, p.labels, max, p.showGrid, c, true),
    ...barRects(plot, p.labels.length, series, max).map((b) => rect(b.x, b.y, b.w, b.h, { fill: colors[b.series % colors.length], r: 3 })),
  ].join("");
};
