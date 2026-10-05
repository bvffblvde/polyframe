import { z } from "zod";

export const segmentedSchema = z.object({
  options: z.array(z.string()),
  activeIndex: z.number().int().min(0).max(20),
});
export type SegmentedProps = z.infer<typeof segmentedSchema>;
