import type { Rect } from "../document/types";

export interface GuideLine {
  axis: "x" | "y";
  pos: number;
  from: number;
  to: number;
}

export interface DistanceLabel {
  axis: "x" | "y";
  from: number;
  to: number;
  at: number;
  value: number;
}

export interface GuideResult {
  dx: number;
  dy: number;
  lines: GuideLine[];
  labels: DistanceLabel[];
}

const xs = (r: Rect) => [r.x, r.x + r.w / 2, r.x + r.w];
const ys = (r: Rect) => [r.y, r.y + r.h / 2, r.y + r.h];

function bestOffset(moving: number[], targets: number[][], threshold: number): number | null {
  let best: number | null = null;
  for (const t of targets) {
    for (const tv of t) {
      for (const mv of moving) {
        const d = tv - mv;
        if (Math.abs(d) <= threshold && (best === null || Math.abs(d) < Math.abs(best))) best = d;
      }
    }
  }
  return best;
}

export function snapToGuides(moving: Rect, targets: Rect[], threshold: number): GuideResult {
  const ox = bestOffset(xs(moving), targets.map(xs), threshold);
  const oy = bestOffset(ys(moving), targets.map(ys), threshold);
  const dx = ox === null ? 0 : Math.round(ox);
  const dy = oy === null ? 0 : Math.round(oy);
  const m = { ...moving, x: moving.x + dx, y: moving.y + dy };
  const lines: GuideLine[] = [];
  for (const t of targets) {
    if (ox !== null) {
      for (const tv of xs(t)) {
        if (xs(m).some((mv) => Math.abs(mv - tv) < 0.5)) {
          lines.push({ axis: "x", pos: tv, from: Math.min(m.y, t.y), to: Math.max(m.y + m.h, t.y + t.h) });
        }
      }
    }
    if (oy !== null) {
      for (const tv of ys(t)) {
        if (ys(m).some((mv) => Math.abs(mv - tv) < 0.5)) {
          lines.push({ axis: "y", pos: tv, from: Math.min(m.x, t.x), to: Math.max(m.x + m.w, t.x + t.w) });
        }
      }
    }
  }
  return { dx, dy, lines: dedupe(lines), labels: distanceLabels(m, targets) };
}

function dedupe(lines: GuideLine[]): GuideLine[] {
  const map = new Map<string, GuideLine>();
  for (const l of lines) {
    const key = `${l.axis}:${l.pos}`;
    const prev = map.get(key);
    map.set(key, prev ? { ...l, from: Math.min(prev.from, l.from), to: Math.max(prev.to, l.to) } : l);
  }
  return [...map.values()];
}

export function distanceLabels(m: Rect, targets: Rect[]): DistanceLabel[] {
  let left: DistanceLabel | null = null;
  let right: DistanceLabel | null = null;
  let top: DistanceLabel | null = null;
  let bottom: DistanceLabel | null = null;
  for (const t of targets) {
    const overlapY = Math.min(m.y + m.h, t.y + t.h) - Math.max(m.y, t.y);
    const overlapX = Math.min(m.x + m.w, t.x + t.w) - Math.max(m.x, t.x);
    if (overlapY > 0) {
      const at = Math.max(m.y, t.y) + overlapY / 2;
      const gl = m.x - (t.x + t.w);
      if (gl > 0 && (!left || gl < left.value)) left = { axis: "x", from: t.x + t.w, to: m.x, at, value: gl };
      const gr = t.x - (m.x + m.w);
      if (gr > 0 && (!right || gr < right.value)) right = { axis: "x", from: m.x + m.w, to: t.x, at, value: gr };
    }
    if (overlapX > 0) {
      const at = Math.max(m.x, t.x) + overlapX / 2;
      const gt = m.y - (t.y + t.h);
      if (gt > 0 && (!top || gt < top.value)) top = { axis: "y", from: t.y + t.h, to: m.y, at, value: gt };
      const gb = t.y - (m.y + m.h);
      if (gb > 0 && (!bottom || gb < bottom.value)) bottom = { axis: "y", from: m.y + m.h, to: t.y, at, value: gb };
    }
  }
  return [left, right, top, bottom].filter((l): l is DistanceLabel => l !== null);
}
