import { z } from "zod";

export const statSchema = z.object({
  label: z.string(),
  value: z.string(),
  delta: z.string(),
  trend: z.enum(["up", "down"]),
});
export type StatProps = z.infer<typeof statSchema>;
