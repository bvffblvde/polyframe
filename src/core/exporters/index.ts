import { layoutParent, readGridLayout, readStackLayout } from "../document/autolayout";
import type { ID, Node, Project } from "../document/types";
import { registry } from "../registry";
import { applyLayout, type LayoutAdapter, type LayoutEntry } from "./layout/layout";
import { MUI_BOX, muiHeader, muiLayout } from "./targets/mui";
import { shadcnHeader, shadcnLayout } from "./targets/shadcn";
import { chakraLayout, packageHeader, styleLayout } from "./targets/style";
import type { ExportTarget, ImportSpec, LayoutStrategy } from "./types";

export * from "./types";

export const CONTAINER_TYPES = new Set(["box", "card"]);

export interface TargetDefinition {
  id: ExportTarget;
  label: string;
  layout: LayoutAdapter;
  baseImports: ImportSpec[];
  header: (imports: ImportSpec[]) => string[];
  item: (node: Node, size: ItemSize, child: string) => string;
}

export interface ItemSize {
  w: boolean;
  h: boolean;
  selfStretch: boolean;
}

const px = (n: number) => `${Math.round(n)}px`;

const styleItem = (n: Node, s: ItemSize, child: string) =>
  `<div style={{ flexShrink: 0${s.selfStretch ? ', alignSelf: "stretch"' : ""}${s.w ? `, width: ${n.w}` : ""}${s.h ? `, height: ${n.h}` : ""} }}>${child}</div>`;

export const targets: Record<ExportTarget, TargetDefinition> = {
  shadcn: {
    id: "shadcn",
    label: "shadcn/ui + Tailwind",
    layout: shadcnLayout,
    baseImports: [],
    header: shadcnHeader,
    item: (n, s, child) =>
      `<div className="shrink-0${s.selfStretch ? " self-stretch" : ""}${s.w ? ` w-[${px(n.w)}]` : ""}${s.h ? ` h-[${px(n.h)}]` : ""}">${child}</div>`,
  },
  mui: {
    id: "mui",
    label: "MUI",
    layout: muiLayout,
    baseImports: [MUI_BOX],
    header: muiHeader,
    item: (n, s, child) =>
      `<Box sx={{ flexShrink: 0${s.selfStretch ? ', alignSelf: "stretch"' : ""}${s.w ? `, width: ${n.w}` : ""}${s.h ? `, height: ${n.h}` : ""} }}>${child}</Box>`,
  },
  mantine: {
    id: "mantine",
    label: "Mantine",
    layout: styleLayout,
    baseImports: [],
    item: styleItem,
    header: packageHeader(["@mantine/core", "@mantine/hooks"], ["Wrap the app in MantineProvider and import \"@mantine/core/styles.css\"."]),
  },
  antd: { id: "antd", label: "Ant Design", layout: styleLayout, baseImports: [], item: styleItem, header: packageHeader(["antd"], []) },
  bootstrap: {
    id: "bootstrap",
    label: "React Bootstrap",
    layout: styleLayout,
    baseImports: [],
    item: styleItem,
    header: packageHeader(["react-bootstrap", "bootstrap"], ["Import \"bootstrap/dist/css/bootstrap.min.css\" once in the app."]),
  },
  chakra: {
    id: "chakra",
    label: "Chakra UI",
    layout: chakraLayout,
    baseImports: [{ from: "@chakra-ui/react", names: ["Box", "Flex"] }],
    item: (n, s, child) =>
      `<Box flexShrink={0}${s.selfStretch ? ' alignSelf="stretch"' : ""}${s.w ? ` w="${px(n.w)}"` : ""}${s.h ? ` h="${px(n.h)}"` : ""}>${child}</Box>`,
    header: packageHeader(["@chakra-ui/react", "@emotion/react"], ["Wrap the app in ChakraProvider with the default system."]),
  },
};

export interface GeneratedFile {
  artboardId: string;
  componentName: string;
  fileName: string;
  code: string;
  warnings: string[];
}

export function componentName(name: string): string {
  const words = name
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const pascal = words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  if (!pascal) return "Screen";
  return /^[0-9]/.test(pascal) ? `Screen${pascal}` : pascal;
}

export function renderImports(imports: ImportSpec[]): string {
  const map = new Map<string, Set<string>>();
  for (const i of imports) {
    const set = map.get(i.from) ?? new Set<string>();
    for (const n of i.names) set.add(n);
    map.set(i.from, set);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([from, names]) => {
      const all = [...names];
      const def = all.find((n) => n.startsWith("default as "))?.slice("default as ".length);
      const named = all.filter((n) => !n.startsWith("default as ")).sort();
      const parts = [def, named.length ? `{ ${named.join(", ")} }` : ""].filter(Boolean).join(", ");
      return `import ${parts} from "${from}";`;
    })
    .join("\n");
}

export function generateArtboardCode(
  p: Project,
  artboardId: string,
  target: ExportTarget,
  strategy: LayoutStrategy,
  usedNames: Set<string> = new Set(),
): GeneratedFile {
  const a = p.artboards[artboardId];
  const def = targets[target];
  const imports: ImportSpec[] = [...def.baseImports];
  const warnings: string[] = [];
  const entries: LayoutEntry[] = [];
  const kids = new Map<ID, ID[]>();
  const topLevel: ID[] = [];
  for (const id of a.childOrder) {
    const node = p.nodes[id];
    if (!node || node.hidden) continue;
    const parent = layoutParent(p, node);
    if (parent) kids.set(parent.id, [...(kids.get(parent.id) ?? []), id]);
    else topLevel.push(id);
  }
  const prefix = componentName(a.name).toLowerCase();
  const render = (id: ID): string => {
    const node = p.nodes[id];
    const exporter = registry[node.type].exporters?.[target];
    let children: string | undefined;
    if (kids.has(id)) {
      let size: ItemSize;
      if (node.type === "grid") {
        const grid = readGridLayout(node);
        size = { w: !grid.fill, h: grid.align !== "stretch", selfStretch: false };
      } else {
        const stack = readStackLayout(node);
        const stretch = stack.align === "stretch";
        const row = stack.direction === "row";
        size = { w: !(stretch && !row), h: !(stretch && row), selfStretch: stretch };
      }
      children = (kids.get(id) ?? []).map((cid) => def.item(p.nodes[cid], size, render(cid))).join("\n");
    }
    if (!exporter) {
      warnings.push(`${node.name} (${node.type})`);
      return `{/* Polyframe: no ${target} exporter for "${node.type}" */}<div />`;
    }
    const chunk = exporter(node, { target, uid: `${prefix}-${a.childOrder.indexOf(id) + 1}`, children });
    if (chunk.imports) imports.push(...chunk.imports);
    return chunk.jsx;
  };
  for (const id of topLevel) {
    const node = p.nodes[id];
    entries.push({
      id,
      rect: { x: node.x, y: node.y, w: node.w, h: node.h },
      opacity: node.opacity,
      jsx: render(id),
      container: CONTAINER_TYPES.has(node.type),
    });
  }
  let name = componentName(a.name);
  let i = 2;
  const base = name;
  while (usedNames.has(name)) name = `${base}${i++}`;
  usedNames.add(name);
  const body = applyLayout(strategy, a, entries, def.layout);
  const header = [`Generated by Polyframe: ${def.label}, ${strategy} layout.`, ...def.header(imports)];
  const code = [
    `/**\n${header.map((l) => ` * ${l}`).join("\n")}\n */`,
    renderImports(imports),
    `export default function ${name}() {\n  return (\n${body}\n  );\n}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return { artboardId, componentName: name, fileName: `${name}.tsx`, code: `${code}\n`, warnings };
}

export function generateProjectCode(p: Project, target: ExportTarget, strategy: LayoutStrategy): GeneratedFile[] {
  const used = new Set<string>();
  return p.artboardOrder.map((id) => generateArtboardCode(p, id, target, strategy, used));
}
