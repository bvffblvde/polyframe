import { z } from "zod";

export type FieldDescriptor =
  | { key: string; kind: "text"; multiline: boolean }
  | { key: string; kind: "number"; min?: number; max?: number }
  | { key: string; kind: "boolean" }
  | { key: string; kind: "enum"; options: string[] }
  | { key: string; kind: "list" }
  | { key: string; kind: "table" }
  | { key: string; kind: "numbers" };

export function describeFields(schema: z.ZodType): FieldDescriptor[] {
  if (!(schema instanceof z.ZodObject)) return [];
  const out: FieldDescriptor[] = [];
  for (const [key, field] of Object.entries(schema.shape as Record<string, z.ZodType>)) {
    if (field instanceof z.ZodString) {
      out.push({ key, kind: "text", multiline: field.meta()?.multiline === true });
    } else if (field instanceof z.ZodNumber) {
      out.push({ key, kind: "number", min: field.minValue ?? undefined, max: field.maxValue ?? undefined });
    } else if (field instanceof z.ZodBoolean) {
      out.push({ key, kind: "boolean" });
    } else if (field instanceof z.ZodEnum) {
      out.push({ key, kind: "enum", options: field.options.map(String) });
    } else if (field instanceof z.ZodArray) {
      out.push({ key, kind: field.element instanceof z.ZodArray ? "table" : field.element instanceof z.ZodNumber ? "numbers" : "list" });
    }
  }
  return out;
}

export const CELL_SEPARATOR = "|";

export function listToText(items: string[]): string {
  return items.join("\n");
}

export function textToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function tableToText(rows: string[][]): string {
  return rows.map((r) => r.join(` ${CELL_SEPARATOR} `)).join("\n");
}

export function textToTable(text: string): string[][] {
  return textToList(text).map((line) => line.split(CELL_SEPARATOR).map((c) => c.trim()));
}

export function numbersToText(values: number[]): string {
  return values.join(", ");
}

export function textToNumbers(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}
