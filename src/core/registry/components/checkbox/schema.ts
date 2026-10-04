import { z } from "zod";

export const checkboxSchema = z.object({
  label: z.string(),
  checked: z.boolean(),
  disabled: z.boolean(),
});
export type CheckboxProps = z.infer<typeof checkboxSchema>;
