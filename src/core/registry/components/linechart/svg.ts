import { chartColors, svgAxes, svgLegend } from "../../../exporters/svg/charts";
import { path } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { areaPath, linePath, linePoints, plotArea, seriesMax } from "../../shared/chart";
import { chartSeries } from "../barchart/schema";
import type { LinechartProps } from "./schema";

export const linechartSvg: SvgDrawer<LinechartProps> = (n, c) => {
  const p = n.props;
  const series = chartSeries(p);
  const plot = plotArea(n.w, n.h, p.showLegend);
  const max = seriesMax(series);
  const colors = chartColors(c);
  return [
    p.showLegend ? svgLegend(plot.x, 12, p.series.slice(0, series.length), c) : "",
    svgAxes(plot, p.labels, max, p.showGrid, c, false),
    ...series.map((values, i) => {
      const pts = linePoints(plot, values, p.labels.length, max);
      const color = colors[i % colors.length];
      return (p.area ? path(areaPath(pts, p.smooth, plot.y + plot.h), { fill: color, opacity: 0.2 }) : "") + path(linePath(pts, p.smooth), { stroke: color, sw: 2 });
    }),
  ].join("");
};
