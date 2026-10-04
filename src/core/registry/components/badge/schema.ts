import { z } from "zod";

export const badgeSchema = z.object({
  text: z.string(),
  variant: z.enum(["solid", "soft", "outline"]),
});
export type BadgeProps = z.infer<typeof badgeSchema>;
