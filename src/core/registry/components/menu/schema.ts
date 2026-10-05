import { z } from "zod";

export const menuSchema = z.object({
  items: z.array(z.string()),
  activeIndex: z.number().int().min(-1).max(30),
  destructiveLast: z.boolean(),
});
export type MenuProps = z.infer<typeof menuSchema>;
