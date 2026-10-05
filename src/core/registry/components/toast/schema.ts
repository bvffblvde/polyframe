import { z } from "zod";

export const toastSchema = z.object({
  title: z.string(),
  description: z.string(),
  actionLabel: z.string(),
  variant: z.enum(["info", "success", "warning", "danger"]),
});
export type ToastProps = z.infer<typeof toastSchema>;
