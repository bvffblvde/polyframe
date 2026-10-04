import type { Rect } from "../document/types";
import type { Point } from "./rect";

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 4;
export const ZOOM_STEPS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

export function clampZoom(z: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

export function screenToWorld(p: Point, vp: Viewport): Point {
  return { x: (p.x - vp.x) / vp.zoom, y: (p.y - vp.y) / vp.zoom };
}

export function worldToScreen(p: Point, vp: Viewport): Point {
  return { x: p.x * vp.zoom + vp.x, y: p.y * vp.zoom + vp.y };
}

export function zoomAt(vp: Viewport, zoom: number, screen: Point): Viewport {
  const z = clampZoom(zoom);
  const world = screenToWorld(screen, vp);
  return { zoom: z, x: screen.x - world.x * z, y: screen.y - world.y * z };
}

export function stepZoom(zoom: number, dir: 1 | -1): number {
  if (dir > 0) return ZOOM_STEPS.find((s) => s > zoom + 1e-6) ?? MAX_ZOOM;
  return [...ZOOM_STEPS].reverse().find((s) => s < zoom - 1e-6) ?? MIN_ZOOM;
}

export function fitRect(rect: Rect, view: { width: number; height: number }, padding = 48): Viewport {
  const availW = Math.max(1, view.width - padding * 2);
  const availH = Math.max(1, view.height - padding * 2);
  const zoom = clampZoom(Math.min(availW / Math.max(1, rect.w), availH / Math.max(1, rect.h)));
  return {
    zoom,
    x: (view.width - rect.w * zoom) / 2 - rect.x * zoom,
    y: (view.height - rect.h * zoom) / 2 - rect.y * zoom,
  };
}

export function centerOn(p: Point, zoom: number, view: { width: number; height: number }): Viewport {
  const z = clampZoom(zoom);
  return { zoom: z, x: view.width / 2 - p.x * z, y: view.height / 2 - p.y * z };
}

export function visibleWorldRect(vp: Viewport, view: { width: number; height: number }): Rect {
  const a = screenToWorld({ x: 0, y: 0 }, vp);
  return { x: a.x, y: a.y, w: view.width / vp.zoom, h: view.height / vp.zoom };
}
