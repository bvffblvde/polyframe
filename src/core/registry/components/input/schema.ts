import { z } from "zod";

export const inputSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  value: z.string(),
  helperText: z.string(),
  size: z.enum(["sm", "md", "lg"]),
  invalid: z.boolean(),
  disabled: z.boolean(),
});
export type InputProps = z.infer<typeof inputSchema>;
