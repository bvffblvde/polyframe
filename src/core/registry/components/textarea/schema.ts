import { z } from "zod";

export const textareaSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  value: z.string().meta({ multiline: true }),
  disabled: z.boolean(),
});
export type TextareaProps = z.infer<typeof textareaSchema>;
