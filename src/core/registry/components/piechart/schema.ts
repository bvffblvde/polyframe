import { z } from "zod";

export const piechartSchema = z.object({
  labels: z.array(z.string()),
  values: z.array(z.number()),
  donut: z.boolean(),
  showLegend: z.boolean(),
});
export type PiechartProps = z.infer<typeof piechartSchema>;
