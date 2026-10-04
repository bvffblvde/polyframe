import { z } from "zod";

export const sidebarSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
  activeIndex: z.number().int().min(0).max(50),
});
export type SidebarProps = z.infer<typeof sidebarSchema>;
