import type { ComponentExporters, ImportSpec } from "../../../exporters/types";
import { PALETTES } from "../barchart/recharts";
import type { PiechartProps } from "./schema";

const MANTINE = ["blue.6", "teal.6", "yellow.6", "red.6", "grape.6"];
const data = (p: PiechartProps, colors: readonly string[]) => p.labels.map((name, i) => ({ name, value: p.values[i] ?? 0, fill: colors[i % colors.length] }));

function recharts(p: PiechartProps, colors: readonly string[]): { jsx: string; imports: ImportSpec[] } {
  return {
    jsx: [
      '<ResponsiveContainer width="100%" height="100%">',
      "<PieChart>",
      `<Pie data={${JSON.stringify(data(p, colors))}} dataKey="value" nameKey="name"${p.donut ? ' innerRadius="60%"' : ""} />`,
      "<RechartsTooltip />",
      p.showLegend ? '<RechartsLegend layout="vertical" align="right" verticalAlign="middle" />' : "",
      "</PieChart>",
      "</ResponsiveContainer>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "recharts", names: ["Pie", "PieChart", "ResponsiveContainer", "Tooltip as RechartsTooltip", ...(p.showLegend ? ["Legend as RechartsLegend"] : [])] }],
  };
}

export const piechartExporters: ComponentExporters<PiechartProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<ChartContainer config={{ ${p.labels.map((l, i) => `"s${i}": { label: ${JSON.stringify(l)}, color: "var(--chart-${(i % 5) + 1})" }`).join(", ")} }} className="h-full w-full">`,
      "<PieChart>",
      "<ChartTooltip content={<ChartTooltipContent hideLabel />} />",
      `<Pie data={${JSON.stringify(p.labels.map((_, i) => ({ key: `s${i}`, value: p.values[i] ?? 0, fill: `var(--color-s${i})` })))}} dataKey="value" nameKey="key"${p.donut ? " innerRadius={60}" : ""} />`,
      p.showLegend ? '<ChartLegend content={<ChartLegendContent nameKey="key" />} />' : "",
      "</PieChart>",
      "</ChartContainer>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/chart", names: ["ChartContainer", "ChartTooltip", "ChartTooltipContent", ...(p.showLegend ? ["ChartLegend", "ChartLegendContent"] : [])] },
      { from: "recharts", names: ["Pie", "PieChart"] },
    ],
  }),
  mui: ({ props: p, h }) => ({
    jsx: `<PieChart height={${h}} series={[{ data: ${JSON.stringify(p.labels.map((label, i) => ({ id: i, value: p.values[i] ?? 0, label })))}${p.donut ? ', innerRadius: "60%"' : ""} }]}${p.showLegend ? "" : " hideLegend"} />`,
    imports: [{ from: "@mui/x-charts/PieChart", names: ["PieChart"] }],
  }),
  mantine: ({ props: p, h }) => {
    const Chart = p.donut ? "DonutChart" : "PieChart";
    return {
      jsx: `<${Chart} size={${Math.max(80, h - 40)}} data={${JSON.stringify(p.labels.map((name, i) => ({ name, value: p.values[i] ?? 0, color: MANTINE[i % MANTINE.length] })))}} withTooltip${p.showLegend ? " withLabels" : ""} />`,
      imports: [{ from: "@mantine/charts", names: [Chart] }],
    };
  },
  antd: ({ props: p }) => recharts(p, PALETTES.antd),
  bootstrap: ({ props: p }) => recharts(p, PALETTES.bootstrap),
  chakra: ({ props: p }) => recharts(p, PALETTES.chakra),
};
