import type { ComponentExporters } from "../../../exporters/types";
import { PALETTES, rechartsCartesian, shadcnCartesian } from "./recharts";
import { chartRows, type BarchartProps } from "./schema";

const MANTINE = ["blue.6", "teal.6", "yellow.6", "red.6", "grape.6"];

export const barchartExporters: ComponentExporters<BarchartProps> = {
  shadcn: ({ props: p }) => shadcnCartesian("bar", p),
  mui: ({ props: p, h }) => ({
    jsx: `<BarChart height={${h}} xAxis={[{ scaleType: "band", data: ${JSON.stringify(p.labels)} }]} series={[${[p.values, ...(p.values2.length ? [p.values2] : [])].map((v, i) => `{ data: ${JSON.stringify(v)}, label: ${JSON.stringify(p.series[i] ?? "")} }`).join(", ")}]}${p.showGrid ? " grid={{ horizontal: true }}" : ""}${p.showLegend ? "" : " hideLegend"} />`,
    imports: [{ from: "@mui/x-charts/BarChart", names: ["BarChart"] }],
  }),
  mantine: ({ props: p, h }) => ({
    jsx: `<BarChart h={${h}} data={${JSON.stringify(chartRows(p))}} dataKey="label" series={[${(p.values2.length ? ["s1", "s2"] : ["s1"]).map((k, i) => `{ name: "${k}", label: ${JSON.stringify(p.series[i] ?? k)}, color: "${MANTINE[i]}" }`).join(", ")}]}${p.showLegend ? " withLegend" : ""} gridAxis="${p.showGrid ? "y" : "none"}" />`,
    imports: [{ from: "@mantine/charts", names: ["BarChart"] }],
  }),
  antd: ({ props: p }) => rechartsCartesian("bar", p, PALETTES.antd),
  bootstrap: ({ props: p }) => rechartsCartesian("bar", p, PALETTES.bootstrap),
  chakra: ({ props: p }) => rechartsCartesian("bar", p, PALETTES.chakra),
};
