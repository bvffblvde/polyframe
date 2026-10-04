export interface SkinTokens {
  font: string;
  fontSize: number;
  headingWeight: number;
  text: string;
  textMuted: string;
  bg: string;
  surface: string;
  mutedBg: string;
  border: string;
  primary: string;
  primaryFg: string;
  secondary: string;
  secondaryFg: string;
  neutral: string;
  neutralFg: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
  radius: number;
  radiusLg: number;
  shadow1: string;
  shadow2: string;
  shadow3: string;
  controlH: number;
  controlHSm: number;
  controlHLg: number;
  borderWidth: number;
  focusRing: string;
}

export interface SkinStructure {
  inputLabel: "above" | "floating";
  tabs: "underline" | "pills" | "segmented";
  switch: "inset" | "material";
}

export interface SkinComponentVars {
  buttonTransform: string;
  buttonWeight: number;
  buttonLetterSpacing: string;
  buttonShadow: string;
  cardShadow: string;
  inputBg: string;
  badgeRadius: string;
  tableHeadBg: string;
  navbarBg: string;
  navbarFg: string;
}

export interface SkinDefinition {
  tokens: SkinTokens;
  vars: SkinComponentVars;
  structure: SkinStructure;
}

export const COLOR_TOKENS = [
  "primary",
  "primaryFg",
  "secondary",
  "secondaryFg",
  "text",
  "textMuted",
  "bg",
  "surface",
  "mutedBg",
  "border",
  "danger",
  "success",
  "warning",
  "info",
] as const satisfies readonly (keyof SkinTokens)[];

export const NUMBER_TOKENS = ["radius", "radiusLg", "borderWidth", "controlH", "fontSize"] as const satisfies readonly (keyof SkinTokens)[];

export const TEXT_TOKENS = ["font"] as const satisfies readonly (keyof SkinTokens)[];

export type EditableToken = (typeof COLOR_TOKENS)[number] | (typeof NUMBER_TOKENS)[number] | (typeof TEXT_TOKENS)[number];

export type TokenOverrides = Partial<Pick<SkinTokens, EditableToken>>;

export const NUMBER_LIMITS: Record<(typeof NUMBER_TOKENS)[number], [number, number]> = {
  radius: [0, 64],
  radiusLg: [0, 64],
  borderWidth: [0, 8],
  controlH: [16, 96],
  fontSize: [8, 32],
};

export function isSafeCssValue(value: string): boolean {
  return value.length > 0 && value.length <= 200 && !/[;{}<>\\`]|url\s*\(|expression\s*\(|@import/i.test(value);
}
