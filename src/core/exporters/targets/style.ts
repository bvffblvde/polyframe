import type { LayoutAdapter } from "../layout/layout";
import type { ImportSpec } from "../types";

const op = (o: number) => (o < 1 ? `, opacity: ${Math.round(o * 100) / 100}` : "");
const m = (key: string, n: number) => (n ? `, ${key}: ${n}` : "");

export const styleLayout: LayoutAdapter = {
  absoluteRoot: (a, children) =>
    `<div style={{ position: "relative", width: ${a.width}, height: ${a.height}, overflow: "hidden" }}>\n${children}\n</div>`,
  absoluteItem: (r, o, child) =>
    `<div style={{ position: "absolute", left: ${r.x}, top: ${r.y}, width: ${r.w}, height: ${r.h}${op(o)} }}>${child}</div>`,
  stackRoot: (a, children) =>
    `<div style={{ display: "flex", flexDirection: "column", width: ${a.width}, minHeight: ${a.height} }}>\n${children}\n</div>`,
  stackRow: (mt, children) => `<div style={{ display: "flex", alignItems: "flex-start"${m("marginTop", mt)} }}>\n${children}\n</div>`,
  stackItem: (ml, mt, r, o, child) =>
    `<div style={{ flexShrink: 0${m("marginLeft", ml)}${m("marginTop", mt)}, width: ${r.w}, height: ${r.h}${op(o)} }}>${child}</div>`,
  stackContainer: (ml, mt, r, o, background, children) =>
    `<div style={{ position: "relative", flexShrink: 0${m("marginLeft", ml)}${m("marginTop", mt)}, width: ${r.w}, minHeight: ${r.h}${op(o)} }}>\n<div style={{ position: "absolute", inset: 0 }}>${background}</div>\n<div style={{ position: "relative", display: "flex", flexDirection: "column" }}>\n${children}\n</div>\n</div>`,
};

export const chakraLayout: LayoutAdapter = {
  absoluteRoot: (a, children) => `<Box position="relative" w="${a.width}px" h="${a.height}px" overflow="hidden" colorPalette="teal">\n${children}\n</Box>`,
  absoluteItem: (r, o, child) =>
    `<Box position="absolute" left="${r.x}px" top="${r.y}px" w="${r.w}px" h="${r.h}px"${o < 1 ? ` opacity={${Math.round(o * 100) / 100}}` : ""}>${child}</Box>`,
  stackRoot: (a, children) => `<Flex direction="column" w="${a.width}px" minH="${a.height}px" colorPalette="teal">\n${children}\n</Flex>`,
  stackRow: (mt, children) => `<Flex align="flex-start"${mt ? ` mt="${mt}px"` : ""}>\n${children}\n</Flex>`,
  stackItem: (ml, mt, r, o, child) =>
    `<Box flexShrink={0}${ml ? ` ml="${ml}px"` : ""}${mt ? ` mt="${mt}px"` : ""} w="${r.w}px" h="${r.h}px"${o < 1 ? ` opacity={${Math.round(o * 100) / 100}}` : ""}>${child}</Box>`,
  stackContainer: (ml, mt, r, o, background, children) =>
    `<Box position="relative" flexShrink={0}${ml ? ` ml="${ml}px"` : ""}${mt ? ` mt="${mt}px"` : ""} w="${r.w}px" minH="${r.h}px"${o < 1 ? ` opacity={${Math.round(o * 100) / 100}}` : ""}>\n<Box position="absolute" inset="0">${background}</Box>\n<Flex position="relative" direction="column">\n${children}\n</Flex>\n</Box>`,
};

export function packageHeader(base: string[], notes: string[]) {
  return (imports: ImportSpec[]): string[] => {
    const deps = new Set(base);
    for (const i of imports) if (!i.from.startsWith("@/")) deps.add(i.from.split("/").slice(0, i.from.startsWith("@") ? 2 : 1).join("/"));
    return [`Dependencies: ${[...deps].sort().join(" ")}`, ...notes];
  };
}
