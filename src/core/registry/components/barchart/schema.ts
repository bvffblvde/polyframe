import { z } from "zod";

export const barchartSchema = z.object({
  labels: z.array(z.string()),
  values: z.array(z.number()),
  values2: z.array(z.number()),
  series: z.array(z.string()),
  showGrid: z.boolean(),
  showLegend: z.boolean(),
});
export type BarchartProps = z.infer<typeof barchartSchema>;

export function chartSeries(p: { values: number[]; values2: number[] }): number[][] {
  return p.values2.length ? [p.values, p.values2] : [p.values];
}

export function chartRows(p: { labels: string[]; values: number[]; values2: number[] }) {
  return p.labels.map((label, i) => ({ label, s1: p.values[i] ?? 0, ...(p.values2.length ? { s2: p.values2[i] ?? 0 } : {}) }));
}
