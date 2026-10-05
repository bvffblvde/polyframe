import { z } from "zod";

export const modalSchema = z.object({
  title: z.string(),
  body: z.string().meta({ multiline: true }),
  confirmLabel: z.string(),
  cancelLabel: z.string(),
});
export type ModalProps = z.infer<typeof modalSchema>;
