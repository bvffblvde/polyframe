import { z } from "zod";

export const paginationSchema = z.object({
  pages: z.number().int().min(1).max(999),
  current: z.number().int().min(1).max(999),
});
export type PaginationProps = z.infer<typeof paginationSchema>;
