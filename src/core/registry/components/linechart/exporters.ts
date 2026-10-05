import type { ComponentExporters } from "../../../exporters/types";
import { PALETTES, rechartsCartesian, shadcnCartesian } from "../barchart/recharts";
import { chartRows } from "../barchart/schema";
import type { LinechartProps } from "./schema";

const MANTINE = ["blue.6", "teal.6", "yellow.6", "red.6", "grape.6"];
const kind = (p: LinechartProps) => (p.area ? "area" : "line");

export const linechartExporters: ComponentExporters<LinechartProps> = {
  shadcn: ({ props: p }) => shadcnCartesian(kind(p), p),
  mui: ({ props: p, h }) => ({
    jsx: `<LineChart height={${h}} xAxis={[{ scaleType: "point", data: ${JSON.stringify(p.labels)} }]} series={[${[p.values, ...(p.values2.length ? [p.values2] : [])].map((v, i) => `{ data: ${JSON.stringify(v)}, label: ${JSON.stringify(p.series[i] ?? "")}, curve: "${p.smooth ? "natural" : "linear"}", showMark: false${p.area ? ", area: true" : ""} }`).join(", ")}]}${p.showGrid ? " grid={{ horizontal: true }}" : ""}${p.showLegend ? "" : " hideLegend"} />`,
    imports: [{ from: "@mui/x-charts/LineChart", names: ["LineChart"] }],
  }),
  mantine: ({ props: p, h }) => {
    const Chart = p.area ? "AreaChart" : "LineChart";
    return {
      jsx: `<${Chart} h={${h}} data={${JSON.stringify(chartRows(p))}} dataKey="label" series={[${(p.values2.length ? ["s1", "s2"] : ["s1"]).map((k, i) => `{ name: "${k}", label: ${JSON.stringify(p.series[i] ?? k)}, color: "${MANTINE[i]}" }`).join(", ")}]} curveType="${p.smooth ? "natural" : "linear"}" withDots={false}${p.showLegend ? " withLegend" : ""} gridAxis="${p.showGrid ? "y" : "none"}" />`,
      imports: [{ from: "@mantine/charts", names: [Chart] }],
    };
  },
  antd: ({ props: p }) => rechartsCartesian(kind(p), p, PALETTES.antd),
  bootstrap: ({ props: p }) => rechartsCartesian(kind(p), p, PALETTES.bootstrap),
  chakra: ({ props: p }) => rechartsCartesian(kind(p), p, PALETTES.chakra),
};
