import type { CustomSkin, Mode, SkinChoice, SkinId } from "../document/types";
import type { SkinDefinition, SkinStructure } from "./tokens";
import { antd } from "./antd";
import { bootstrap } from "./bootstrap";
import { chakra } from "./chakra";
import { fluent } from "./fluent";
import { mantine } from "./mantine";
import { mui } from "./mui";
import { radix } from "./radix";
import { shadcn } from "./shadcn";
import { wireframe } from "./wireframe";

export const skins: Record<SkinId, SkinDefinition> = { shadcn, mui, mantine, antd, bootstrap, chakra, fluent, radix };
export { wireframe };

export const SKIN_LABELS: Record<SkinId, string> = {
  shadcn: "shadcn/ui",
  mui: "MUI",
  mantine: "Mantine",
  antd: "Ant Design",
  bootstrap: "Bootstrap",
  chakra: "Chakra UI",
  fluent: "Fluent 2",
  radix: "Radix Themes",
};

export function activeSkin(mode: Mode, skin: SkinId): SkinDefinition {
  return mode === "wireframe" ? wireframe : skins[skin];
}

export function skinStructure(mode: Mode, skin: SkinId): SkinStructure {
  return activeSkin(mode, skin).structure;
}

const px = (n: number) => `${n}px`;

export function skinCssVars(def: SkinDefinition): Record<string, string> {
  const t = def.tokens;
  const v = def.vars;
  return {
    "--pf-font": t.font,
    "--pf-font-size": px(t.fontSize),
    "--pf-heading-weight": String(t.headingWeight),
    "--pf-text": t.text,
    "--pf-text-muted": t.textMuted,
    "--pf-bg": t.bg,
    "--pf-surface": t.surface,
    "--pf-muted-bg": t.mutedBg,
    "--pf-border": t.border,
    "--pf-primary": t.primary,
    "--pf-primary-fg": t.primaryFg,
    "--pf-secondary": t.secondary,
    "--pf-secondary-fg": t.secondaryFg,
    "--pf-neutral": t.neutral,
    "--pf-neutral-fg": t.neutralFg,
    "--pf-danger": t.danger,
    "--pf-success": t.success,
    "--pf-warning": t.warning,
    "--pf-info": t.info,
    "--pf-radius-base": px(t.radius),
    "--pf-radius-lg": px(t.radiusLg),
    "--pf-shadow-1": t.shadow1,
    "--pf-shadow-2": t.shadow2,
    "--pf-shadow-3": t.shadow3,
    "--pf-control-h": px(t.controlH),
    "--pf-control-h-sm": px(t.controlHSm),
    "--pf-control-h-lg": px(t.controlHLg),
    "--pf-stroke": px(t.borderWidth),
    "--pf-focus-ring": t.focusRing,
    "--pf-button-transform": v.buttonTransform,
    "--pf-button-weight": String(v.buttonWeight),
    "--pf-button-letter-spacing": v.buttonLetterSpacing,
    "--pf-button-shadow": v.buttonShadow,
    "--pf-card-shadow": v.cardShadow,
    "--pf-input-bg": v.inputBg,
    "--pf-badge-radius": v.badgeRadius,
    "--pf-table-head-bg": v.tableHeadBg,
    "--pf-navbar-bg": v.navbarBg,
    "--pf-navbar-fg": v.navbarFg,
    "--pf-chart-1": t.primary,
    "--pf-chart-2": t.info,
    "--pf-chart-3": t.success,
    "--pf-chart-4": t.warning,
    "--pf-chart-5": t.danger,
  };
}

function block(selector: string, vars: Record<string, string>): string {
  return `${selector}{${Object.entries(vars)
    .map(([k, val]) => `${k}:${val}`)
    .join(";")}}`;
}

export function buildSkinCss(): string {
  const parts = [block('.pf-root[data-mode="wireframe"]', skinCssVars(wireframe))];
  for (const [id, def] of Object.entries(skins)) {
    parts.push(block(`.pf-root[data-mode="styled"][data-skin="${id}"]`, skinCssVars(def)));
  }
  return parts.join("\n");
}

export function structureSkin(choice: SkinChoice, custom?: CustomSkin): SkinId {
  return choice === "custom" ? (custom?.base ?? "shadcn") : choice;
}

export function mergeCustomSkin(custom: CustomSkin): SkinDefinition {
  const base = skins[custom.base];
  return { ...base, tokens: { ...base.tokens, ...custom.tokens } };
}

export function customSkinCss(custom: CustomSkin, skinAttr = "custom"): string {
  return block(`.pf-root[data-mode="styled"][data-skin="${skinAttr}"]`, skinCssVars(mergeCustomSkin(custom)));
}
