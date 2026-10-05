import { z } from "zod";

export const spinnerSchema = z.object({
  label: z.string(),
  size: z.enum(["sm", "md", "lg"]),
});
export type SpinnerProps = z.infer<typeof spinnerSchema>;
