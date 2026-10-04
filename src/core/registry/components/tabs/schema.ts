import { z } from "zod";

export const tabsSchema = z.object({
  tabs: z.array(z.string()),
  activeIndex: z.number().int().min(0).max(50),
  content: z.string().meta({ multiline: true }),
});
export type TabsProps = z.infer<typeof tabsSchema>;
