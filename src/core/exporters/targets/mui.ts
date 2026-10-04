import type { LayoutAdapter } from "../layout/layout";
import type { ImportSpec } from "../types";

const op = (o: number) => (o < 1 ? `, opacity: ${Math.round(o * 100) / 100}` : "");

export const MUI_BOX: ImportSpec = { from: "@mui/material", names: ["Box"] };

export const muiLayout: LayoutAdapter = {
  absoluteRoot: (a, children) =>
    `<Box sx={{ position: "relative", width: ${a.width}, height: ${a.height}, overflow: "hidden", bgcolor: "background.paper" }}>\n${children}\n</Box>`,
  absoluteItem: (r, o, child) =>
    `<Box sx={{ position: "absolute", left: ${r.x}, top: ${r.y}, width: ${r.w}, height: ${r.h}${op(o)} }}>${child}</Box>`,
  stackRoot: (a, children) =>
    `<Box sx={{ display: "flex", flexDirection: "column", width: ${a.width}, minHeight: ${a.height}, bgcolor: "background.paper" }}>\n${children}\n</Box>`,
  stackRow: (mt, children) => `<Box sx={{ display: "flex", alignItems: "flex-start"${mt ? `, mt: "${mt}px"` : ""} }}>\n${children}\n</Box>`,
  stackItem: (ml, mt, r, o, child) =>
    `<Box sx={{ flexShrink: 0${ml ? `, ml: "${ml}px"` : ""}${mt ? `, mt: "${mt}px"` : ""}, width: ${r.w}, height: ${r.h}${op(o)} }}>${child}</Box>`,
  stackContainer: (ml, mt, r, o, background, children) =>
    `<Box sx={{ position: "relative", flexShrink: 0${ml ? `, ml: "${ml}px"` : ""}${mt ? `, mt: "${mt}px"` : ""}, width: ${r.w}, minHeight: ${r.h}${op(o)} }}>\n<Box sx={{ position: "absolute", inset: 0 }}>${background}</Box>\n<Box sx={{ position: "relative", display: "flex", flexDirection: "column" }}>\n${children}\n</Box>\n</Box>`,
};

export function muiHeader(imports: ImportSpec[]): string[] {
  const deps = new Set(["@mui/material", "@emotion/react", "@emotion/styled"]);
  for (const i of imports) if (!i.from.startsWith("@/")) deps.add(i.from);
  return [`Dependencies: ${[...deps].sort().join(" ")}`];
}
