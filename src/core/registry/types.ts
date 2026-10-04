import type { FC } from "react";
import type { LucideIcon } from "lucide-react";
import type { z } from "zod";
import type { ComponentType, Mode, Node, SkinId } from "../document/types";

export type Translator = (key: string) => string;
export type Category = "layout" | "inputs" | "typography" | "media" | "data";
export const CATEGORIES: Category[] = ["layout", "inputs", "typography", "media", "data"];

export interface RenderProps<P> {
  props: P;
  node: Node;
  mode: Mode;
  skin: SkinId;
}

export interface ComponentDefinition<P = Record<string, unknown>> {
  type: ComponentType;
  category: Category;
  labelKey: string;
  keywords: string[];
  icon: LucideIcon;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  propsSchema: z.ZodType<P>;
  defaultProps: (t: Translator) => P;
  Render: FC<RenderProps<P>>;
}

export type AnyDefinition = ComponentDefinition<Record<string, unknown>>;

export function defineComponent<S extends z.ZodType>(propsSchema: S) {
  return (def: Omit<ComponentDefinition<z.infer<S>>, "propsSchema">): AnyDefinition =>
    ({ ...def, propsSchema }) as unknown as AnyDefinition;
}

export function list(t: Translator, key: string): string[] {
  return t(key)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}
