import { z } from "zod";

export const tooltipSchema = z.object({
  text: z.string(),
  trigger: z.string(),
  placement: z.enum(["top", "bottom"]),
});
export type TooltipProps = z.infer<typeof tooltipSchema>;
