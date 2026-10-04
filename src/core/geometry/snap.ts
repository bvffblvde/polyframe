export function snapValue(v: number, step: number): number {
  if (step <= 0) return Math.round(v);
  return Math.round(v / step) * step;
}

export function snapDelta(origin: number, delta: number, step: number): number {
  return snapValue(origin + delta, step) - origin;
}

export function nudgeStep(shift: boolean, grid: { enabled: boolean; size: number }): number {
  if (!shift) return 1;
  return grid.enabled ? grid.size : 10;
}
