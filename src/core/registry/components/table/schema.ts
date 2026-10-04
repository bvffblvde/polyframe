import { z } from "zod";

export const tableSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  striped: z.boolean(),
  bordered: z.boolean(),
});
export type TableProps = z.infer<typeof tableSchema>;
