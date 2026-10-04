export function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const n = (v: number) => Math.round(v * 100) / 100;

interface Paint {
  fill?: string;
  stroke?: string;
  sw?: number;
  dash?: string;
  opacity?: number;
}

function paint(p: Paint): string {
  const out = [`fill="${p.fill ? esc(p.fill) : "none"}"`];
  if (p.stroke) out.push(`stroke="${esc(p.stroke)}"`, `stroke-width="${n(p.sw ?? 1)}"`);
  if (p.dash) out.push(`stroke-dasharray="${p.dash}"`);
  if (p.opacity !== undefined && p.opacity < 1) out.push(`fill-opacity="${n(p.opacity)}"`);
  return out.join(" ");
}

export function rect(x: number, y: number, w: number, h: number, p: Paint & { r?: number } = {}): string {
  const r = p.r ? ` rx="${n(Math.min(p.r, w / 2, h / 2))}"` : "";
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, w))}" height="${n(Math.max(0, h))}"${r} ${paint(p)}/>`;
}

export function circle(cx: number, cy: number, r: number, p: Paint = {}): string {
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" ${paint(p)}/>`;
}

export function line(x1: number, y1: number, x2: number, y2: number, stroke: string, sw = 1, dash?: string): string {
  return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${esc(stroke)}" stroke-width="${n(sw)}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

export function path(d: string, p: Paint = {}): string {
  return `<path d="${d}" ${paint(p)} stroke-linecap="round" stroke-linejoin="round"/>`;
}

export interface TextStyle {
  size: number;
  fill: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  family: string;
  decoration?: "underline";
}

export function measure(value: string, size: number, weight = 400): number {
  return value.length * size * (weight >= 600 ? 0.58 : 0.54);
}

export function text(x: number, y: number, value: string, s: TextStyle): string {
  if (!value) return "";
  const attrs = [
    `x="${n(x)}"`,
    `y="${n(y + s.size * 0.35)}"`,
    `font-family="${esc(s.family)}"`,
    `font-size="${n(s.size)}"`,
    `fill="${esc(s.fill)}"`,
  ];
  if (s.weight && s.weight !== 400) attrs.push(`font-weight="${s.weight}"`);
  if (s.anchor && s.anchor !== "start") attrs.push(`text-anchor="${s.anchor}"`);
  if (s.decoration) attrs.push(`text-decoration="${s.decoration}"`);
  return `<text ${attrs.join(" ")}>${esc(value)}</text>`;
}

export function truncate(value: string, width: number, size: number, weight = 400): string {
  if (measure(value, size, weight) <= width) return value;
  const max = Math.max(1, Math.floor(width / (size * (weight >= 600 ? 0.58 : 0.54))) - 1);
  return `${value.slice(0, max)}…`;
}

export function wrap(value: string, width: number, size: number, weight = 400): string[] {
  const out: string[] = [];
  for (const paragraph of value.split("\n")) {
    let lineText = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = lineText ? `${lineText} ${word}` : word;
      if (measure(next, size, weight) > width && lineText) {
        out.push(lineText);
        lineText = word;
      } else lineText = next;
    }
    out.push(lineText);
  }
  return out;
}

export function paragraph(x: number, y: number, value: string, width: number, maxHeight: number, s: TextStyle, leading = 1.45): string {
  const lh = s.size * leading;
  const lines = wrap(value, width, s.size, s.weight).slice(0, Math.max(1, Math.floor(maxHeight / lh)));
  const ax = s.anchor === "middle" ? x + width / 2 : s.anchor === "end" ? x + width : x;
  return lines.map((l, i) => text(ax, y + lh / 2 + i * lh, l, s)).join("");
}
