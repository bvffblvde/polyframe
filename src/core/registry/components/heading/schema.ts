import { z } from "zod";

export const headingSchema = z.object({
  text: z.string(),
  level: z.enum(["1", "2", "3", "4"]),
  align: z.enum(["left", "center", "right"]),
});
export type HeadingProps = z.infer<typeof headingSchema>;
