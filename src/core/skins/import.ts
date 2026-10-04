import { COLOR_TOKENS, isSafeCssValue, NUMBER_LIMITS, NUMBER_TOKENS, type EditableToken, type TokenOverrides } from "./tokens";

const ALIASES: Record<EditableToken, string[]> = {
  primary: ["primary", "brand", "brand-primary", "primary-main", "primary-500", "accent-primary", "colorprimary"],
  primaryFg: ["primary-foreground", "on-primary", "primary-contrast", "primary-contrasttext", "primary-fg", "primary-text"],
  secondary: ["secondary", "secondary-main"],
  secondaryFg: ["secondary-foreground", "on-secondary", "secondary-contrasttext"],
  text: ["foreground", "text", "text-primary", "fg", "fg-default", "on-surface", "on-background", "body-color", "colortext"],
  textMuted: ["muted-foreground", "text-secondary", "text-muted", "fg-muted", "text-subtle", "secondary-text"],
  bg: ["background", "bg", "background-default", "body-bg", "colorbgbase", "canvas"],
  surface: ["card", "surface", "paper", "background-paper", "popover", "colorbgcontainer"],
  mutedBg: ["muted", "bg-muted", "bg-subtle", "background-muted", "surface-variant"],
  border: ["border", "border-color", "divider", "colorborder", "border-default"],
  danger: ["destructive", "danger", "error", "error-main", "colorerror"],
  success: ["success", "success-main", "colorsuccess"],
  warning: ["warning", "warning-main", "colorwarning"],
  info: ["info", "info-main", "colorinfo"],
  radius: ["radius", "border-radius", "radius-md", "rounded", "borderradius", "shape-borderradius"],
  radiusLg: ["radius-lg", "border-radius-lg", "radius-large", "borderradiuslg"],
  borderWidth: ["border-width", "borderwidth", "linewidth"],
  controlH: ["control-height", "controlheight", "input-height", "height-control"],
  fontSize: ["font-size", "font-size-base", "fontsize", "typography-fontsize", "text-base"],
  font: ["font-family", "font-sans", "fontfamily", "typography-fontfamily", "font-body"],
};

const MATCHERS = (Object.entries(ALIASES) as [EditableToken, string[]][])
  .flatMap(([token, names]) => names.map((name) => ({ token, name })))
  .sort((a, b) => b.name.length - a.name.length);

export interface TokenImportResult {
  tokens: TokenOverrides;
  matched: EditableToken[];
  scanned: number;
}

interface Entry {
  path: string[];
  value: unknown;
}

function flatten(node: unknown, path: string[], out: Entry[]) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    out.push({ path, value: node });
    return;
  }
  const obj = node as Record<string, unknown>;
  if ("$value" in obj) return void out.push({ path, value: obj.$value });
  if ("value" in obj && (typeof obj.value === "string" || typeof obj.value === "number")) return void out.push({ path, value: obj.value });
  for (const [k, v] of Object.entries(obj)) if (!k.startsWith("$")) flatten(v, [...path, k], out);
}

function parseCssVariables(text: string): Entry[] {
  const out: Entry[] = [];
  for (const m of text.matchAll(/--([\w-]+)\s*:\s*([^;}]+)/g)) out.push({ path: [m[1]], value: m[2].trim() });
  return out;
}

function normalize(path: string[]): string {
  return path
    .map((p) => p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replace(/[^a-z0-9-]+/g, "-"))
    .join("-")
    .replace(/^-+|-+$/g, "");
}

function matchToken(path: string[]): EditableToken | null {
  const key = normalize(path);
  const compact = key.replace(/-/g, "");
  for (const { token, name } of MATCHERS) {
    if (key === name || key.endsWith(`-${name}`) || compact === name.replace(/-/g, "")) return token;
  }
  return null;
}

function toPixels(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  const m = value.trim().match(/^(-?\d*\.?\d+)\s*(px|rem|em)?$/);
  if (!m) return null;
  const n = Number(m[1]);
  return m[2] === "rem" || m[2] === "em" ? n * 16 : n;
}

function toColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%(\s*\/\s*[\d.]+%?)?$/.test(v)) return `hsl(${v})`;
  if (/^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^)]*\)|[a-z]+)$/i.test(v) && isSafeCssValue(v)) return v;
  return null;
}

export function importTokens(input: string): TokenImportResult | null {
  const text = input.trim();
  if (!text) return null;
  let entries: Entry[];
  if (text.startsWith("{") || text.startsWith("[")) {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return null;
    }
    entries = [];
    flatten(data, [], entries);
  } else {
    entries = parseCssVariables(text);
  }
  const tokens: TokenOverrides = {};
  const matched: EditableToken[] = [];
  for (const { path, value } of entries) {
    const token = matchToken(path);
    if (!token || matched.includes(token)) continue;
    if ((COLOR_TOKENS as readonly string[]).includes(token)) {
      const c = toColor(value);
      if (!c) continue;
      tokens[token as (typeof COLOR_TOKENS)[number]] = c;
    } else if ((NUMBER_TOKENS as readonly string[]).includes(token)) {
      const n = toPixels(value);
      const key = token as (typeof NUMBER_TOKENS)[number];
      if (n === null) continue;
      const [min, max] = NUMBER_LIMITS[key];
      tokens[key] = Math.round(Math.min(max, Math.max(min, n)));
    } else {
      if (typeof value !== "string" || !isSafeCssValue(value)) continue;
      tokens.font = value;
    }
    matched.push(token);
  }
  return { tokens, matched, scanned: entries.length };
}
