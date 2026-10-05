import { z } from "zod";

export const breadcrumbsSchema = z.object({
  items: z.array(z.string()),
  separator: z.enum(["slash", "chevron"]),
});
export type BreadcrumbsProps = z.infer<typeof breadcrumbsSchema>;
