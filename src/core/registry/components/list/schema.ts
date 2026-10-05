import { z } from "zod";

export const listSchema = z.object({
  items: z.array(z.string()),
  secondary: z.array(z.string()),
  showAvatar: z.boolean(),
  dividers: z.boolean(),
});
export type ListProps = z.infer<typeof listSchema>;
