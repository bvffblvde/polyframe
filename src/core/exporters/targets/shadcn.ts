import type { LayoutAdapter } from "../layout/layout";
import type { ImportSpec } from "../types";

const px = (n: number) => `${Math.round(n)}px`;
const opacity = (o: number) => (o < 1 ? ` opacity-[${Math.round(o * 100) / 100}]` : "");

export const shadcnLayout: LayoutAdapter = {
  absoluteRoot: (a, children) =>
    `<div className="relative w-[${px(a.width)}] h-[${px(a.height)}] overflow-hidden bg-background text-foreground">\n${children}\n</div>`,
  absoluteItem: (r, o, child) =>
    `<div className="absolute left-[${px(r.x)}] top-[${px(r.y)}] w-[${px(r.w)}] h-[${px(r.h)}]${opacity(o)}">${child}</div>`,
  stackRoot: (a, children) =>
    `<div className="flex w-[${px(a.width)}] min-h-[${px(a.height)}] flex-col bg-background text-foreground">\n${children}\n</div>`,
  stackRow: (mt, children) => `<div className="flex items-start${mt ? ` mt-[${px(mt)}]` : ""}">\n${children}\n</div>`,
  stackItem: (ml, mt, r, o, child) =>
    `<div className="shrink-0${ml ? ` ml-[${px(ml)}]` : ""}${mt ? ` mt-[${px(mt)}]` : ""} w-[${px(r.w)}] h-[${px(r.h)}]${opacity(o)}">${child}</div>`,
  stackContainer: (ml, mt, r, o, background, children) =>
    `<div className="relative shrink-0${ml ? ` ml-[${px(ml)}]` : ""}${mt ? ` mt-[${px(mt)}]` : ""} w-[${px(r.w)}] min-h-[${px(r.h)}]${opacity(o)}">\n<div className="absolute inset-0">${background}</div>\n<div className="relative flex flex-col">\n${children}\n</div>\n</div>`,
};

export function shadcnHeader(imports: ImportSpec[]): string[] {
  const ui = imports
    .filter((i) => i.from.startsWith("@/components/ui/"))
    .map((i) => i.from.slice("@/components/ui/".length));
  const deps = imports.filter((i) => !i.from.startsWith("@/")).map((i) => i.from);
  const out = [];
  if (ui.length) out.push(`Install: npx shadcn@latest add ${[...new Set(ui)].sort().join(" ")}`);
  if (deps.length) out.push(`Dependencies: ${[...new Set(deps)].sort().join(" ")}`);
  return out;
}
