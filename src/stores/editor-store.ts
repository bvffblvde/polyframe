import { create } from "zustand";
import type { ID, Mode, Node, Rect, SkinChoice } from "@/core/document/types";
import type { DistanceLabel, GuideLine } from "@/core/geometry/guides";
import type { Viewport } from "@/core/geometry/viewport";

export type Interaction = "idle" | "dragging" | "resizing" | "marquee" | "panning";
export type DialogId = "projects" | "exportPng" | "exportCode" | "shortcuts" | "share" | "command" | "customSkin" | null;

interface EditorState {
  selection: ID[];
  hoveredId: ID | null;
  viewport: Viewport;
  viewSize: { width: number; height: number };
  activeArtboardId: ID | null;
  preview: Record<ID, Rect> | null;
  marquee: Rect | null;
  guides: { artboardId: ID; lines: GuideLine[]; labels: DistanceLabel[] } | null;
  interaction: Interaction;
  spaceDown: boolean;
  leftTab: "components" | "layers";
  dialog: DialogId;
  clipboard: Node[];
  fitRequest: number;
  tour: number | null;
  viewOverride: { mode: Mode; skin: SkinChoice } | null;
  set: (patch: Partial<Omit<EditorState, "set">>) => void;
  select: (ids: ID[]) => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
  selection: [],
  hoveredId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  viewSize: { width: 1, height: 1 },
  activeArtboardId: null,
  preview: null,
  marquee: null,
  guides: null,
  interaction: "idle",
  spaceDown: false,
  leftTab: "components",
  dialog: null,
  clipboard: [],
  fitRequest: 0,
  tour: null,
  viewOverride: null,
  set: (patch) => set(patch),
  select: (selection) => set({ selection }),
}));
