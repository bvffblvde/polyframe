export type Placement = "right" | "left" | "bottom" | "inside";

export interface TourStep {
  id: string;
  target: string | null;
  placement: Placement;
}

export const TOUR_STEPS: TourStep[] = [
  { id: "welcome", target: null, placement: "inside" },
  { id: "palette", target: "palette", placement: "right" },
  { id: "canvas", target: "canvas", placement: "inside" },
  { id: "inspector", target: "inspector", placement: "left" },
  { id: "layers", target: "layers-tab", placement: "right" },
  { id: "mode", target: "mode-skin", placement: "bottom" },
  { id: "export", target: "export", placement: "bottom" },
  { id: "share", target: "share", placement: "bottom" },
  { id: "help", target: "help", placement: "bottom" },
];

export const TOUR_DONE_KEY = "polyframe:tour-done";

export function tourDone(): boolean {
  try {
    return window.localStorage.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markTourDone() {
  try {
    window.localStorage.setItem(TOUR_DONE_KEY, "1");
  } catch {}
}
