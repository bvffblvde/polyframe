import type { Artboard, ArtboardPreset, ID, Project } from "./types";
import { PRESET_SIZES } from "./types";

export const ARTBOARD_GAP = 160;

export function newArtboard(
  p: Project | null,
  opts: { id: ID; name: string; preset: ArtboardPreset; width?: number; height?: number },
): Artboard {
  const size = opts.preset === "custom" ? { width: 800, height: 600 } : PRESET_SIZES[opts.preset];
  let x = 0;
  let y = 0;
  if (p && p.artboardOrder.length) {
    const right = Math.max(...p.artboardOrder.map((id) => p.artboards[id].x + p.artboards[id].width));
    x = right + ARTBOARD_GAP;
    y = Math.min(...p.artboardOrder.map((id) => p.artboards[id].y));
  }
  return {
    id: opts.id,
    name: opts.name,
    x,
    y,
    width: opts.width ?? size.width,
    height: opts.height ?? size.height,
    preset: opts.preset,
    childOrder: [],
  };
}
