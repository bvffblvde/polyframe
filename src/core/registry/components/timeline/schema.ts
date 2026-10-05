import { z } from "zod";

export const timelineSchema = z.object({
  events: z.array(z.string()),
  dates: z.array(z.string()),
  activeIndex: z.number().int().min(0).max(50),
});
export type TimelineProps = z.infer<typeof timelineSchema>;
