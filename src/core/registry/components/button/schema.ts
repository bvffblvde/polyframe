import { z } from "zod";

export const buttonSchema = z.object({
  label: z.string(),
  variant: z.enum(["solid", "outline", "ghost"]),
  size: z.enum(["sm", "md", "lg"]),
  disabled: z.boolean(),
});
export type ButtonProps = z.infer<typeof buttonSchema>;
