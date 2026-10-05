import { z } from "zod";

export const gridSchema = z.object({
  columns: z.number().int().min(1).max(12),
  columnGap: z.number().int().min(0).max(200),
  rowGap: z.number().int().min(0).max(200),
  padding: z.number().int().min(0).max(200),
  fill: z.boolean(),
  align: z.enum(["start", "center", "end", "stretch"]),
  hug: z.boolean(),
  background: z.enum(["none", "surface", "muted"]),
});
export type GridProps = z.infer<typeof gridSchema>;

export const GRID_ALIGN = { start: "start", center: "center", end: "end", stretch: "stretch" } as const;

export function gridColumns(n: number): string {
  return `repeat(${n}, minmax(0, 1fr))`;
}
