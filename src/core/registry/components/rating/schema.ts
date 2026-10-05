import { z } from "zod";

export const ratingSchema = z.object({
  value: z.number().min(0).max(10),
  count: z.number().int().min(1).max(10),
});
export type RatingProps = z.infer<typeof ratingSchema>;
