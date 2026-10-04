import { z } from "zod";

export const dividerSchema = z.object({
  orientation: z.enum(["horizontal", "vertical"]),
  label: z.string(),
});
export type DividerProps = z.infer<typeof dividerSchema>;
