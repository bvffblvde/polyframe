import { z } from "zod";

export const linkSchema = z.object({
  text: z.string(),
  underline: z.boolean(),
});
export type LinkProps = z.infer<typeof linkSchema>;
