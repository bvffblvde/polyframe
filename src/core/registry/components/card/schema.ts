import { z } from "zod";

export const cardSchema = z.object({
  title: z.string(),
  body: z.string().meta({ multiline: true }),
  showFooter: z.boolean(),
  actionLabel: z.string(),
});
export type CardProps = z.infer<typeof cardSchema>;
