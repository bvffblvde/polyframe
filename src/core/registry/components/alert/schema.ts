import { z } from "zod";

export const alertSchema = z.object({
  title: z.string(),
  description: z.string().meta({ multiline: true }),
  variant: z.enum(["info", "success", "warning", "danger"]),
});
export type AlertProps = z.infer<typeof alertSchema>;
