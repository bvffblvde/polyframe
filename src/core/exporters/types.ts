import type { Node } from "../document/types";

export const EXPORT_TARGETS = ["shadcn", "mui", "mantine", "antd", "bootstrap", "chakra"] as const;
export type ExportTarget = (typeof EXPORT_TARGETS)[number];
export const LAYOUT_STRATEGIES = ["absolute", "stacked"] as const;
export type LayoutStrategy = (typeof LAYOUT_STRATEGIES)[number];

export interface ImportSpec {
  from: string;
  names: string[];
}

export interface ExportChunk {
  jsx: string;
  imports?: ImportSpec[];
}

export interface ExportCtx {
  target: ExportTarget;
  uid: string;
  children?: string;
}

export type ComponentExporter<P = Record<string, unknown>> = (node: Node & { props: P }, ctx: ExportCtx) => ExportChunk;

export type ComponentExporters<P = Record<string, unknown>> = Partial<Record<ExportTarget, ComponentExporter<P>>>;
