import { z } from "zod";

export const progressSchema = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
  showValue: z.boolean(),
});
export type ProgressProps = z.infer<typeof progressSchema>;
