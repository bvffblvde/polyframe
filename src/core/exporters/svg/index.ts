import type { Artboard, CustomSkin, Node, Project } from "../../document/types";
import { registry } from "../../registry";
import { activeSkin, mergeCustomSkin, structureSkin, skins } from "../../skins";
import type { SkinDefinition } from "../../skins/tokens";
import { esc, rect, text } from "./primitives";
import type { SvgCtx } from "./types";

export type { SvgCtx, SvgDrawer } from "./types";

function resolveFamily(font: string): string {
  return font.replace(/var\(--font-geist-sans\)/g, "Geist").replace(/var\([^)]*\)\s*,?/g, "").trim() || "sans-serif";
}

function resolveVar(value: string, def: SkinDefinition): string {
  const m = value.match(/^var\(--pf-(surface|text)\)$/);
  if (!m) return value;
  return m[1] === "surface" ? def.tokens.surface : def.tokens.text;
}

function skinFor(p: Project): SkinDefinition {
  const { mode, skin, customSkin } = p.settings;
  if (mode === "wireframe") return activeSkin("wireframe", "shadcn");
  if (skin === "custom" && customSkin) return mergeCustomSkin(customSkin as CustomSkin);
  return skins[structureSkin(skin, customSkin)];
}

function ctxFor(def: SkinDefinition, p: Project, node: Node): SvgCtx {
  const t = def.tokens;
  const roles = {
    primary: [t.primary, t.primaryFg],
    secondary: [t.secondary, t.secondaryFg],
    neutral: [t.neutral, t.neutralFg],
    danger: [t.danger, "#ffffff"],
    success: [t.success, "#ffffff"],
  } as const;
  const [accent, accentFg] = roles[node.style?.colorRole ?? "primary"];
  const styled = p.settings.mode === "styled";
  const radius = styled && node.style?.radius !== undefined ? node.style.radius : t.radius;
  return {
    mode: p.settings.mode,
    t,
    vars: { ...def.vars, navbarBg: resolveVar(def.vars.navbarBg, def), navbarFg: resolveVar(def.vars.navbarFg, def) },
    structure: def.structure,
    family: resolveFamily(p.settings.mode === "wireframe" && p.settings.sketchFont ? "Caveat, cursive" : t.font),
    accent,
    accentFg,
    radius,
    radiusLg: styled && node.style?.radius !== undefined ? node.style.radius : t.radiusLg,
  };
}

function layerId(node: Node, used: Set<string>): string {
  const base = node.name.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "") || node.type;
  let id = base;
  let i = 2;
  while (used.has(id)) id = `${base}-${i++}`;
  used.add(id);
  return id;
}

export function artboardToSvg(p: Project, artboardId: string, opts: { transparent?: boolean } = {}): string {
  const a: Artboard = p.artboards[artboardId];
  const def = skinFor(p);
  const used = new Set<string>();
  const layers = a.childOrder
    .map((id) => p.nodes[id])
    .filter((node) => node && !node.hidden)
    .map((node) => {
      const ctx = ctxFor(def, p, node);
      const draw = registry[node.type].svg;
      const body = draw
        ? draw(node, ctx)
        : rect(0, 0, node.w, node.h, { stroke: ctx.t.border, dash: "4 4" }) +
          text(node.w / 2, node.h / 2, node.type, { size: 12, fill: ctx.t.textMuted, anchor: "middle", family: ctx.family });
      const opacity = node.opacity < 1 ? ` opacity="${node.opacity}"` : "";
      return `<g id="${esc(layerId(node, used))}" transform="translate(${node.x} ${node.y})"${opacity}>${body}</g>`;
    });
  const bg = opts.transparent ? "" : rect(0, 0, a.width, a.height, { fill: def.tokens.bg });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="0 0 ${a.width} ${a.height}">`,
    `<title>${esc(a.name)}</title>`,
    `<defs><clipPath id="artboard"><rect width="${a.width}" height="${a.height}"/></clipPath></defs>`,
    `<g id="${esc(a.name.replace(/\s+/g, "-") || "artboard")}" clip-path="url(#artboard)">`,
    bg,
    ...layers,
    "</g>",
    "</svg>",
  ].join("\n");
}
