import { barRects, plotArea, seriesMax } from "../../shared/chart";
import type { RenderProps } from "../../types";
import { ChartAxes, ChartLegend } from "./axes";
import { chartSeries, type BarchartProps } from "./schema";

export function BarchartRender({ props: p, node }: RenderProps<BarchartProps>) {
  const series = chartSeries(p);
  const plot = plotArea(node.w, node.h, p.showLegend);
  const max = seriesMax(series);
  return (
    <div className="pf-chart">
      {p.showLegend && <ChartLegend names={p.series.slice(0, series.length)} />}
      <svg className="pf-chart__svg" viewBox={`0 0 ${node.w} ${node.h}`} aria-hidden>
        <ChartAxes plot={plot} labels={p.labels} max={max} grid={p.showGrid} centered />
        {barRects(plot, p.labels.length, series, max).map((b, i) => (
          <rect key={i} className="pf-chart__bar" data-series={b.series} x={b.x} y={b.y} width={b.w} height={b.h} rx={3} />
        ))}
      </svg>
    </div>
  );
}
