import { z } from "zod";

export const skeletonSchema = z.object({
  lines: z.number().int().min(1).max(12),
  showAvatar: z.boolean(),
});
export type SkeletonProps = z.infer<typeof skeletonSchema>;
