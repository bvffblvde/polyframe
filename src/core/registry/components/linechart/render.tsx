import { areaPath, linePath, linePoints, plotArea, seriesMax } from "../../shared/chart";
import type { RenderProps } from "../../types";
import { ChartAxes, ChartLegend } from "../barchart/axes";
import { chartSeries } from "../barchart/schema";
import type { LinechartProps } from "./schema";

export function LinechartRender({ props: p, node }: RenderProps<LinechartProps>) {
  const series = chartSeries(p);
  const plot = plotArea(node.w, node.h, p.showLegend);
  const max = seriesMax(series);
  return (
    <div className="pf-chart">
      {p.showLegend && <ChartLegend names={p.series.slice(0, series.length)} />}
      <svg className="pf-chart__svg" viewBox={`0 0 ${node.w} ${node.h}`} aria-hidden>
        <ChartAxes plot={plot} labels={p.labels} max={max} grid={p.showGrid} centered={false} />
        {series.map((values, i) => {
          const pts = linePoints(plot, values, p.labels.length, max);
          return (
            <g key={i}>
              {p.area && <path className="pf-chart__area" data-series={i} d={areaPath(pts, p.smooth, plot.y + plot.h)} />}
              <path className="pf-chart__line" data-series={i} d={linePath(pts, p.smooth)} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
