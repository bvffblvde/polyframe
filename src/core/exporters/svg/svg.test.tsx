import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import uk from "../../../../messages/uk.json";
import { addNodes, createProject, updateNodeStyle, updateSettings } from "../../document/ops";
import { COMPONENT_TYPES, SKIN_IDS } from "../../document/types";
import { definitions, registry } from "../../registry";
import { createNode } from "../../registry/create-node";
import { instantiateTemplate, TEMPLATES } from "../../templates";
import { counterIds, makeArtboard } from "../../test/fixtures";
import { artboardToSvg } from "./index";

type Tree = { [k: string]: string | Tree };
const tr = (messages: Tree) => (key: string) => {
  let cur: string | Tree | undefined = messages;
  for (const part of key.split(".")) cur = typeof cur === "object" ? cur[part] : undefined;
  return typeof cur === "string" ? cur : key;
};

function parse(svg: string) {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  expect(doc.getElementsByTagName("parsererror")).toHaveLength(0);
  return doc;
}

function everything() {
  const t = tr(en as Tree);
  const nodes = COMPONENT_TYPES.map((type, i) =>
    createNode({ id: `n${i}`, type, artboardId: "a1", rect: { x: (i % 4) * 360, y: Math.floor(i / 4) * 200, ...registry[type].defaultSize }, name: type, t: (k) => t(`defaults.${k}`) }),
  );
  return addNodes(createProject({ id: "p", name: "All", now: "", artboard: makeArtboard("a1", { name: "All <components> & more" }) }), nodes);
}

describe("svg export", () => {
  it("every component has an svg drawer", () => {
    for (const d of definitions) expect(d.svg, d.type).toBeDefined();
  });

  it("renders every component in every skin and mode as valid svg", () => {
    const base = everything();
    for (const mode of ["wireframe", "styled"] as const) {
      for (const skin of SKIN_IDS) {
        const doc = parse(artboardToSvg(updateSettings(base, { mode, skin }), "a1"));
        expect(doc.querySelectorAll("svg > g > g")).toHaveLength(COMPONENT_TYPES.length);
      }
    }
  });

  it("names layers after nodes and escapes text", () => {
    const p = updateNodeStyle(everything(), ["n5"], { colorRole: "danger", radius: 20 });
    const svg = artboardToSvg(updateSettings(p, { mode: "styled", skin: "mui" }), "a1", { transparent: true });
    const doc = parse(svg);
    expect(doc.querySelector("title")?.textContent).toBe("All <components> & more");
    expect(doc.getElementById("button")).not.toBeNull();
    expect(svg).toContain(">BUTTON<");
    expect(svg).toContain('rx="20"');
    expect(svg).not.toContain('<rect x="0" y="0" width="1440" height="1024"');
  });

  it("uses custom skin tokens", () => {
    const p = updateSettings(everything(), { mode: "styled", skin: "custom", customSkin: { name: "B", base: "antd", tokens: { primary: "#ff0066" } } });
    expect(artboardToSvg(p, "a1")).toContain("#ff0066");
  });

  it.each(TEMPLATES.flatMap((tpl) => [[tpl.id, en], [tpl.id, uk]] as const))("template %s exports", (id, messages) => {
    const tpl = TEMPLATES.find((x) => x.id === id);
    if (!tpl) throw new Error(id);
    const p = instantiateTemplate(tpl, { t: tr(messages as Tree), genId: counterIds(), now: "", projectName: "", artboardName: "A" });
    parse(artboardToSvg(p, p.artboardOrder[0]));
  });

  it("snapshots the styled login screen", () => {
    const tpl = TEMPLATES[0];
    const p = instantiateTemplate(tpl, { t: tr(en as Tree), genId: counterIds(), now: "", projectName: "", artboardName: "Login" });
    expect(artboardToSvg(updateSettings(p, { mode: "styled", skin: "shadcn" }), p.artboardOrder[0])).toMatchSnapshot();
  });
});
