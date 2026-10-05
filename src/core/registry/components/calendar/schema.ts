import { z } from "zod";

export const calendarSchema = z.object({
  year: z.number().int().min(1900).max(2200),
  month: z.number().int().min(1).max(12),
  selected: z.number().int().min(0).max(31),
  weekStart: z.enum(["monday", "sunday"]),
  locale: z.enum(["en", "uk"]),
});
export type CalendarProps = z.infer<typeof calendarSchema>;
