import type { TokenOverrides } from "../skins/tokens";

export type ID = string;

export type Mode = "wireframe" | "styled";
export const SKIN_IDS = ["shadcn", "mui", "mantine", "antd", "bootstrap", "chakra", "fluent", "radix"] as const;
export type SkinId = (typeof SKIN_IDS)[number];
export type SkinChoice = SkinId | "custom";
export const COLOR_ROLES = ["primary", "secondary", "neutral", "danger", "success"] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];
export const GRID_SIZES = [4, 8, 16] as const;
export type GridSize = (typeof GRID_SIZES)[number];
export const ARTBOARD_PRESETS = ["desktop", "laptop", "tablet", "mobile", "custom"] as const;
export type ArtboardPreset = (typeof ARTBOARD_PRESETS)[number];

export const PRESET_SIZES: Record<Exclude<ArtboardPreset, "custom">, { width: number; height: number }> = {
  desktop: { width: 1440, height: 1024 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

export const COMPONENT_TYPES = [
  "box",
  "card",
  "divider",
  "navbar",
  "sidebar",
  "button",
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "switch",
  "slider",
  "heading",
  "text",
  "link",
  "badge",
  "image",
  "avatar",
  "icon",
  "table",
  "tabs",
  "alert",
  "progress",
  "stack",
  "grid",
  "breadcrumbs",
  "pagination",
  "stepper",
  "segmented",
  "rating",
  "avatargroup",
  "list",
  "accordion",
  "timeline",
  "stat",
  "skeleton",
  "spinner",
  "modal",
  "toast",
  "tooltip",
  "menu",
  "dropzone",
] as const;
export type ComponentType = (typeof COMPONENT_TYPES)[number];

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface NodeStyle {
  colorRole?: ColorRole;
  radius?: number;
  shadow?: 0 | 1 | 2 | 3;
}

export interface Node {
  id: ID;
  type: ComponentType;
  artboardId: ID;
  parentId?: ID;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  locked: boolean;
  hidden: boolean;
  opacity: number;
  style?: NodeStyle;
  props: Record<string, unknown>;
}

export interface Artboard {
  id: ID;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  preset: ArtboardPreset;
  background?: string;
  childOrder: ID[];
}

export interface CustomSkin {
  name: string;
  base: SkinId;
  tokens: TokenOverrides;
}

export interface ProjectSettings {
  mode: Mode;
  skin: SkinChoice;
  customSkin?: CustomSkin;
  grid: { enabled: boolean; size: GridSize; visible: boolean };
  sketchFont: boolean;
}

export interface Project {
  schemaVersion: 2;
  id: ID;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
  artboards: Record<ID, Artboard>;
  artboardOrder: ID[];
  nodes: Record<ID, Node>;
}

export type IdGen = () => ID;
