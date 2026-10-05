import { pieSlices } from "../../shared/chart";
import type { RenderProps } from "../../types";
import { ChartLegend } from "../barchart/axes";
import type { PiechartProps } from "./schema";

export function PiechartRender({ props: p, node }: RenderProps<PiechartProps>) {
  const legendW = p.showLegend ? Math.min(160, node.w * 0.4) : 0;
  const size = Math.min(node.w - legendW, node.h) - 8;
  const r = size / 2;
  return (
    <div className="pf-chart" data-layout="pie">
      <svg className="pf-chart__pie" width={size + 8} height={node.h} viewBox={`0 0 ${size + 8} ${node.h}`} aria-hidden>
        {pieSlices(r + 4, node.h / 2, r, p.donut ? r * 0.6 : 0, p.values).map((s) => (
          <path key={s.index} className="pf-chart__slice" data-series={s.index % 5} d={s.path} />
        ))}
      </svg>
      {p.showLegend && <ChartLegend names={p.labels} />}
    </div>
  );
}
