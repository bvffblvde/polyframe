import { z } from "zod";

export const linechartSchema = z.object({
  labels: z.array(z.string()),
  values: z.array(z.number()),
  values2: z.array(z.number()),
  series: z.array(z.string()),
  smooth: z.boolean(),
  area: z.boolean(),
  showGrid: z.boolean(),
  showLegend: z.boolean(),
});
export type LinechartProps = z.infer<typeof linechartSchema>;
