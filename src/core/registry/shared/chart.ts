export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

export function niceMax(value: number): number {
  if (!(value > 0)) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / exp;
  const nice = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => f <= s) ?? 10;
  return nice * exp;
}

export function ticks(max: number, count = 4): number[] {
  return Array.from({ length: count + 1 }, (_, i) => Math.round((max / count) * i * 100) / 100);
}

export function plotArea(w: number, h: number, legend: boolean): Box {
  const top = legend ? 28 : 8;
  return { x: 40, y: top, w: Math.max(1, w - 48), h: Math.max(1, h - top - 24) };
}

export function seriesMax(series: number[][]): number {
  return niceMax(Math.max(0, ...series.flat().filter((v) => Number.isFinite(v))));
}

export function barRects(plot: Box, count: number, series: number[][], max: number): (Box & { series: number; index: number })[] {
  const n = Math.max(1, count);
  const group = plot.w / n;
  const s = Math.max(1, series.length);
  const bar = (group * 0.64) / s;
  const out: (Box & { series: number; index: number })[] = [];
  for (let i = 0; i < n; i++) {
    series.forEach((values, si) => {
      const v = Math.max(0, values[i] ?? 0);
      const h = (v / max) * plot.h;
      out.push({ x: plot.x + group * i + group * 0.18 + bar * si, y: plot.y + plot.h - h, w: bar, h, series: si, index: i });
    });
  }
  return out;
}

export function linePoints(plot: Box, values: number[], count: number, max: number): Point[] {
  const n = Math.max(1, count);
  const step = n > 1 ? plot.w / (n - 1) : 0;
  return Array.from({ length: n }, (_, i) => ({
    x: plot.x + (n > 1 ? step * i : plot.w / 2),
    y: plot.y + plot.h - (Math.max(0, values[i] ?? 0) / max) * plot.h,
  }));
}

const r = (v: number) => Math.round(v * 100) / 100;

export function linePath(points: Point[], smooth: boolean): string {
  if (!points.length) return "";
  if (!smooth || points.length < 3) return points.map((p, i) => `${i ? "L" : "M"}${r(p.x)} ${r(p.y)}`).join(" ");
  let d = `M${r(points[0].x)} ${r(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${r(c1.x)} ${r(c1.y)} ${r(c2.x)} ${r(c2.y)} ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

export function areaPath(points: Point[], smooth: boolean, baseY: number): string {
  if (!points.length) return "";
  const last = points[points.length - 1];
  return `${linePath(points, smooth)} L${r(last.x)} ${r(baseY)} L${r(points[0].x)} ${r(baseY)} Z`;
}

export interface Slice {
  path: string;
  index: number;
  share: number;
}

export function pieSlices(cx: number, cy: number, radius: number, inner: number, values: number[]): Slice[] {
  const clean = values.map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const total = clean.reduce((s, v) => s + v, 0);
  if (!total) return [];
  let angle = -Math.PI / 2;
  const pt = (a: number, rad: number) => `${r(cx + Math.cos(a) * rad)} ${r(cy + Math.sin(a) * rad)}`;
  return clean.flatMap((v, index) => {
    if (!v) return [];
    const share = v / total;
    const start = angle;
    const end = angle + share * Math.PI * 2 - (share === 1 ? 0.0001 : 0);
    angle += share * Math.PI * 2;
    const large = end - start > Math.PI ? 1 : 0;
    const outer = `M${pt(start, radius)} A${r(radius)} ${r(radius)} 0 ${large} 1 ${pt(end, radius)}`;
    const path = inner > 0 ? `${outer} L${pt(end, inner)} A${r(inner)} ${r(inner)} 0 ${large} 0 ${pt(start, inner)} Z` : `${outer} L${r(cx)} ${r(cy)} Z`;
    return [{ path, index, share }];
  });
}
