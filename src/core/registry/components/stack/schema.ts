import { z } from "zod";

export const stackSchema = z.object({
  direction: z.enum(["row", "column"]),
  gap: z.number().int().min(0).max(200),
  padding: z.number().int().min(0).max(200),
  align: z.enum(["start", "center", "end", "stretch"]),
  justify: z.enum(["start", "center", "end", "between"]),
  hug: z.boolean(),
  background: z.enum(["none", "surface", "muted"]),
});
export type StackProps = z.infer<typeof stackSchema>;

export const CSS_ALIGN = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const;
export const CSS_JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;
