import type { Mode, Node } from "../../document/types";
import type { SkinComponentVars, SkinStructure, SkinTokens } from "../../skins/tokens";

export interface SvgCtx {
  mode: Mode;
  t: SkinTokens;
  vars: SkinComponentVars;
  structure: SkinStructure;
  family: string;
  accent: string;
  accentFg: string;
  radius: number;
  radiusLg: number;
}

export type SvgDrawer<P = Record<string, unknown>> = (node: Node & { props: P }, ctx: SvgCtx) => string;
export type AnyDrawer = SvgDrawer<Record<string, unknown>>;

export function anyDrawer<P>(d: SvgDrawer<P>): AnyDrawer {
  return d as unknown as AnyDrawer;
}
