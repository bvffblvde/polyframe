import { z } from "zod";

export const imageSchema = z.object({
  caption: z.string(),
  rounded: z.boolean(),
});
export type ImageProps = z.infer<typeof imageSchema>;
