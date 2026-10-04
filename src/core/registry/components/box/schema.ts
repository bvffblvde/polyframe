import { z } from "zod";

export const boxSchema = z.object({
  label: z.string(),
  variant: z.enum(["outline", "filled", "dashed"]),
});
export type BoxProps = z.infer<typeof boxSchema>;
