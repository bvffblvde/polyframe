import { z } from "zod";

export const radioSchema = z.object({
  label: z.string(),
  options: z.array(z.string()),
  activeIndex: z.number().int().min(0).max(50),
  orientation: z.enum(["vertical", "horizontal"]),
  disabled: z.boolean(),
});
export type RadioProps = z.infer<typeof radioSchema>;
