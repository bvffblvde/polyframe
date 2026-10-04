import { z } from "zod";

export const textSchema = z.object({
  text: z.string().meta({ multiline: true }),
  size: z.enum(["sm", "md", "lg"]),
  align: z.enum(["left", "center", "right"]),
  muted: z.boolean(),
});
export type TextProps = z.infer<typeof textSchema>;
