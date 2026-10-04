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
