import { z } from "zod";

export const sliderSchema = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
  showValue: z.boolean(),
  disabled: z.boolean(),
});
export type SliderProps = z.infer<typeof sliderSchema>;
