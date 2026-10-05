import { z } from "zod";

export const datepickerSchema = z.object({
  label: z.string(),
  value: z.string(),
  placeholder: z.string(),
  locale: z.enum(["en", "uk"]),
  disabled: z.boolean(),
});
export type DatepickerProps = z.infer<typeof datepickerSchema>;
