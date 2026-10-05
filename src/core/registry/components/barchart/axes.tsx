import { ticks, type Box } from "../../shared/chart";

export function ChartAxes({ plot, labels, max, grid, centered }: { plot: Box; labels: string[]; max: number; grid: boolean; centered: boolean }) {
  const n = Math.max(1, labels.length);
  return (
    <g className="pf-chart__axes">
      {ticks(max).map((v) => {
        const y = plot.y + plot.h - (v / max) * plot.h;
        return (
          <g key={v}>
            {grid && <line className="pf-chart__grid" data-base={v === 0 || undefined} x1={plot.x} x2={plot.x + plot.w} y1={y} y2={y} />}
            <text className="pf-chart__tick" x={plot.x - 6} y={y} textAnchor="end" dominantBaseline="middle">
              {v}
            </text>
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text
          key={i}
          className="pf-chart__tick"
          x={centered ? plot.x + (plot.w / n) * (i + 0.5) : plot.x + (n > 1 ? (plot.w / (n - 1)) * i : plot.w / 2)}
          y={plot.y + plot.h + 14}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {l}
        </text>
      ))}
    </g>
  );
}

export function ChartLegend({ names }: { names: string[] }) {
  return (
    <div className="pf-chart__legend">
      {names.map((n, i) => (
        <span key={i} className="pf-chart__legend-item">
          <span className="pf-chart__swatch" data-series={i % 5} />
          {n}
        </span>
      ))}
    </div>
  );
}
