import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { format } from "prettier";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { addNodes, createProject } from "../document/ops";
import { COMPONENT_TYPES } from "../document/types";
import { definitions, registry } from "../registry";
import { createNode } from "../registry/create-node";
import { instantiateTemplate, TEMPLATES } from "../templates";
import { counterIds, makeArtboard } from "../test/fixtures";
import { componentName, EXPORT_TARGETS, generateArtboardCode, generateProjectCode, LAYOUT_STRATEGIES, renderImports } from "./index";
import { nestEntries } from "./layout/layout";
import { inferRows } from "./layout/rows";

type Tree = { [k: string]: string | Tree };
const t = (key: string) => {
  let cur: string | Tree | undefined = en as Tree;
  for (const part of key.split(".")) cur = typeof cur === "object" ? cur[part] : undefined;
  if (typeof cur !== "string") throw new Error(key);
  return cur;
};
const defaults = (k: string) => t(`defaults.${k}`);

function single(type: (typeof COMPONENT_TYPES)[number]) {
  const def = registry[type];
  const node = createNode({ id: "n1", type, artboardId: "a1", rect: { x: 10, y: 20, ...def.defaultSize }, name: type, t: defaults });
  return addNodes(createProject({ id: "p", name: "P", now: "", artboard: makeArtboard("a1", { name: "Login screen" }) }), [node]);
}

function everything() {
  const nodes = COMPONENT_TYPES.map((type, i) =>
    createNode({ id: `n${i}`, type, artboardId: "a1", rect: { x: (i % 4) * 360, y: Math.floor(i / 4) * 200, ...registry[type].defaultSize }, name: type, t: defaults }),
  );
  nodes.push({ ...nodes[0], id: "x1", hidden: false, opacity: 0.5, style: { colorRole: "danger" }, props: { ...nodes[0].props } });
  const button = nodes.find((n) => n.type === "button");
  if (button) nodes.push({ ...button, id: "x2", style: { colorRole: "danger" }, props: { ...button.props, variant: "outline", size: "lg", disabled: true } });
  return addNodes(createProject({ id: "p", name: "All", now: "", artboard: makeArtboard("a1", { name: "All components" }) }), nodes);
}

const pretty = (code: string) => format(code, { parser: "typescript", printWidth: 100 });

describe("component exporters", () => {
  it("every component has an exporter for every target", () => {
    for (const d of definitions) for (const target of EXPORT_TARGETS) expect(d.exporters?.[target], `${d.type} ${target}`).toBeDefined();
  });

  for (const type of COMPONENT_TYPES) {
    for (const target of EXPORT_TARGETS) {
      it(`${type} -> ${target}`, async () => {
        const file = generateArtboardCode(single(type), "a1", target, "absolute");
        expect(file.warnings).toEqual([]);
        expect(await pretty(file.code)).toMatchSnapshot();
      });
    }
  }
});

describe("project generation", () => {
  const templates = TEMPLATES.map((tpl) =>
    instantiateTemplate(tpl, { t, genId: counterIds(tpl.id), now: "", projectName: tpl.id, artboardName: t(`templates.names.${tpl.id}`) }),
  );

  it.each(TEMPLATES.map((tpl, i) => [tpl.id, i] as const))("%s parses for every target and strategy", async (_, i) => {
    for (const target of EXPORT_TARGETS) {
      for (const strategy of LAYOUT_STRATEGIES) {
        const [file] = generateProjectCode(templates[i], target, strategy);
        await expect(pretty(file.code)).resolves.toContain(`export default function ${file.componentName}()`);
      }
    }
  });

  it("snapshots a stacked login screen", async () => {
    const [shadcn] = generateProjectCode(templates[0], "shadcn", "stacked");
    const [mui] = generateProjectCode(templates[0], "mui", "stacked");
    expect(await pretty(shadcn.code)).toMatchSnapshot();
    expect(await pretty(mui.code)).toMatchSnapshot();
  });

  it("skips hidden nodes and makes names unique", () => {
    let p = single("button");
    p = { ...p, nodes: { ...p.nodes, n1: { ...p.nodes.n1, hidden: true } } };
    const files = generateProjectCode(
      { ...p, artboards: { ...p.artboards, a2: makeArtboard("a2", { name: "Login screen" }) }, artboardOrder: ["a1", "a2"] },
      "shadcn",
      "absolute",
    );
    expect(files.map((f) => f.componentName)).toEqual(["LoginScreen", "LoginScreen2"]);
    expect(files[0].code).not.toContain("<Button");
  });

  it("falls back to a placeholder when a target has no exporter", () => {
    const p = single("button");
    const original = registry.button.exporters;
    registry.button.exporters = {};
    try {
      const file = generateArtboardCode(p, "a1", "mui", "absolute");
      expect(file.warnings).toEqual(["button (button)"]);
      expect(file.code).toContain("<div />");
    } finally {
      registry.button.exporters = original;
    }
  });

  it("writes fixtures for the CI type check", () => {
    const dir = process.env.EXPORT_FIXTURE_DIR;
    if (!dir) return;
    for (const target of EXPORT_TARGETS) {
      for (const strategy of LAYOUT_STRATEGIES) {
        const out = path.resolve(dir, target, strategy);
        mkdirSync(out, { recursive: true });
        templates.forEach((p, i) => {
          for (const f of generateProjectCode(p, target, strategy)) writeFileSync(path.join(out, `${TEMPLATES[i].id}-${f.fileName}`), f.code);
        });
        for (const f of generateProjectCode(everything(), target, strategy)) writeFileSync(path.join(out, `all-${f.fileName}`), f.code);
      }
    }
  });
});

describe("helpers", () => {
  it("builds component names", () => {
    expect(componentName("Desktop 1")).toBe("Desktop1");
    expect(componentName("1 screen")).toBe("Screen1Screen");
    expect(componentName("Вхід")).toBe("Screen");
  });

  it("merges and sorts imports", () => {
    expect(renderImports([{ from: "b", names: ["Y", "X"] }, { from: "a", names: ["Z"] }, { from: "b", names: ["X"] }])).toBe(
      'import { Z } from "a";\nimport { X, Y } from "b";',
    );
  });

  it("infers rows by vertical overlap", () => {
    const rows = inferRows([
      { id: "c", rect: { x: 0, y: 100, w: 10, h: 10 } },
      { id: "b", rect: { x: 50, y: 5, w: 10, h: 30 } },
      { id: "a", rect: { x: 0, y: 0, w: 10, h: 10 } },
    ]);
    expect(rows.map((r) => r.items.map((i) => i.id))).toEqual([["a", "b"], ["c"]]);
    expect(rows[0]).toMatchObject({ top: 0, bottom: 35 });
  });
});

describe("nesting", () => {
  it("puts entries inside the smallest containing container", () => {
    const e = (id: string, x: number, y: number, w: number, h: number, container = false) => ({ id, rect: { x, y, w, h }, opacity: 1, jsx: "", container });
    const tree = nestEntries([
      e("outer", 0, 0, 500, 500, true),
      e("inner", 10, 10, 200, 200, true),
      e("a", 20, 20, 10, 10),
      e("b", 300, 300, 10, 10),
      e("twin1", 600, 0, 50, 50, true),
      e("twin2", 600, 0, 50, 50, true),
    ]);
    expect(tree.get(null)?.map((x) => x.id)).toEqual(["outer", "twin1"]);
    expect(tree.get("outer")?.map((x) => x.id)).toEqual(["inner", "b"]);
    expect(tree.get("inner")?.map((x) => x.id)).toEqual(["a"]);
    expect(tree.get("twin1")?.map((x) => x.id)).toEqual(["twin2"]);
  });
});
