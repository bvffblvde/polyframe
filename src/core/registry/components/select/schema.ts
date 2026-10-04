import { z } from "zod";

export const selectSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  options: z.array(z.string()),
  value: z.string(),
  disabled: z.boolean(),
});
export type SelectProps = z.infer<typeof selectSchema>;
