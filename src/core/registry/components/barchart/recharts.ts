import type { ImportSpec } from "../../../exporters/types";
import { chartRows } from "./schema";

export const PALETTES = {
  antd: ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"],
  bootstrap: ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"],
  chakra: ["#319795", "#3182ce", "#dd6b20", "#e53e3e", "#805ad5"],
} as const;

interface Series {
  labels: string[];
  values: number[];
  values2: number[];
  series: string[];
  showGrid: boolean;
  showLegend: boolean;
}

export function rechartsCartesian(kind: "bar" | "line" | "area", p: Series & { smooth?: boolean }, colors: readonly string[]): { jsx: string; imports: ImportSpec[] } {
  const keys = p.values2.length ? ["s1", "s2"] : ["s1"];
  const Chart = { bar: "BarChart", line: "LineChart", area: "AreaChart" }[kind];
  const curve = p.smooth ? "monotone" : "linear";
  const marks = keys.map((k, i) => {
    const name = JSON.stringify(p.series[i] ?? k);
    if (kind === "bar") return `<Bar dataKey="${k}" name={${name}} fill="${colors[i]}" radius={[4, 4, 0, 0]} />`;
    if (kind === "line") return `<Line type="${curve}" dataKey="${k}" name={${name}} stroke="${colors[i]}" strokeWidth={2} dot={false} />`;
    return `<Area type="${curve}" dataKey="${k}" name={${name}} stroke="${colors[i]}" fill="${colors[i]}" fillOpacity={0.25} />`;
  });
  return {
    jsx: [
      '<ResponsiveContainer width="100%" height="100%">',
      `<${Chart} data={${JSON.stringify(chartRows(p))}}>`,
      p.showGrid ? '<CartesianGrid strokeDasharray="3 3" vertical={false} />' : "",
      '<XAxis dataKey="label" tickLine={false} />',
      "<YAxis tickLine={false} />",
      "<RechartsTooltip />",
      p.showLegend ? "<RechartsLegend />" : "",
      ...marks,
      `</${Chart}>`,
      "</ResponsiveContainer>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      {
        from: "recharts",
        names: ["ResponsiveContainer", Chart, { bar: "Bar", line: "Line", area: "Area" }[kind], "XAxis", "YAxis", "Tooltip as RechartsTooltip", ...(p.showGrid ? ["CartesianGrid"] : []), ...(p.showLegend ? ["Legend as RechartsLegend"] : [])],
      },
    ],
  };
}

export function shadcnCartesian(kind: "bar" | "line" | "area", p: Series & { smooth?: boolean }): { jsx: string; imports: ImportSpec[] } {
  const keys = p.values2.length ? ["s1", "s2"] : ["s1"];
  const Chart = { bar: "BarChart", line: "LineChart", area: "AreaChart" }[kind];
  const curve = p.smooth ? "natural" : "linear";
  const config = `{ ${keys.map((k, i) => `${k}: { label: ${JSON.stringify(p.series[i] ?? k)}, color: "var(--chart-${i + 1})" }`).join(", ")} }`;
  const marks = keys.map((k) => {
    if (kind === "bar") return `<Bar dataKey="${k}" fill="var(--color-${k})" radius={4} />`;
    if (kind === "line") return `<Line type="${curve}" dataKey="${k}" stroke="var(--color-${k})" strokeWidth={2} dot={false} />`;
    return `<Area type="${curve}" dataKey="${k}" stroke="var(--color-${k})" fill="var(--color-${k})" fillOpacity={0.3} />`;
  });
  return {
    jsx: [
      `<ChartContainer config={${config}} className="h-full w-full">`,
      `<${Chart} accessibilityLayer data={${JSON.stringify(chartRows(p))}}>`,
      p.showGrid ? "<CartesianGrid vertical={false} />" : "",
      '<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />',
      "<ChartTooltip content={<ChartTooltipContent />} />",
      p.showLegend ? "<ChartLegend content={<ChartLegendContent />} />" : "",
      ...marks,
      `</${Chart}>`,
      "</ChartContainer>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/chart", names: ["ChartContainer", "ChartTooltip", "ChartTooltipContent", ...(p.showLegend ? ["ChartLegend", "ChartLegendContent"] : [])] },
      { from: "recharts", names: [Chart, { bar: "Bar", line: "Line", area: "Area" }[kind], "XAxis", ...(p.showGrid ? ["CartesianGrid"] : [])] },
    ],
  };
}
