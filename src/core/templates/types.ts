import type { ArtboardPreset, ComponentType, NodeStyle } from "../document/types";
import type { Translator } from "../registry/types";

export interface TemplateNode {
  type: ComponentType;
  x: number;
  y: number;
  w: number;
  h: number;
  props?: Record<string, unknown>;
  style?: NodeStyle;
}

export interface TemplateDefinition {
  id: string;
  preset: Exclude<ArtboardPreset, "custom">;
  build: (t: Translator) => TemplateNode[];
}
