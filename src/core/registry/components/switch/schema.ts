import { z } from "zod";

export const switchSchema = z.object({
  label: z.string(),
  checked: z.boolean(),
  disabled: z.boolean(),
});
export type SwitchProps = z.infer<typeof switchSchema>;
