import { z } from "zod";

export const dropzoneSchema = z.object({
  title: z.string(),
  hint: z.string(),
  actionLabel: z.string(),
});
export type DropzoneProps = z.infer<typeof dropzoneSchema>;
