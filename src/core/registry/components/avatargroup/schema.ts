import { z } from "zod";

export const avatargroupSchema = z.object({
  initials: z.array(z.string().max(3)),
  max: z.number().int().min(1).max(20),
});
export type AvatargroupProps = z.infer<typeof avatargroupSchema>;
