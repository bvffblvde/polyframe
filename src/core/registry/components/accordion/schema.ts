import { z } from "zod";

export const accordionSchema = z.object({
  items: z.array(z.string()),
  content: z.string().meta({ multiline: true }),
  openIndex: z.number().int().min(-1).max(20),
});
export type AccordionProps = z.infer<typeof accordionSchema>;
