import { describe, expect, it } from "vitest";
import * as ops from "./ops";
import { artboardNodes, existingIds, nodeArtboardId } from "./selectors";
import { counterIds, makeArtboard, makeNode, makeProject } from "../test/fixtures";

function withNodes(ids: string[], artboardId = "a1") {
  return ops.addNodes(makeProject(), ids.map((id, i) => makeNode(id, artboardId, { x: i * 10 })));
}

describe("project ops", () => {
  it("creates a project with defaults", () => {
    const p = makeProject();
    expect(p.settings.mode).toBe("wireframe");
    expect(p.settings.grid).toEqual({ enabled: true, size: 8, visible: true });
    expect(p.artboardOrder).toEqual(["a1"]);
  });

  it("renames and updates settings without touching other grid fields", () => {
    let p = ops.renameProject(makeProject(), "New");
    p = ops.updateSettings(p, { skin: "mui", grid: { ...p.settings.grid, size: 16 } });
    expect(p.name).toBe("New");
    expect(p.settings.skin).toBe("mui");
    expect(p.settings.grid).toEqual({ enabled: true, size: 16, visible: true });
    expect(ops.updateSettings(p, { mode: "styled" }).settings.grid.size).toBe(16);
  });
});

describe("artboard ops", () => {
  it("adds, updates and removes artboards with their nodes", () => {
    let p = ops.addArtboard(makeProject(), makeArtboard("a2"));
    p = ops.addNodes(p, [makeNode("n1", "a2")]);
    p = ops.updateArtboard(p, "a2", { name: "Two", width: 0.4, x: 10.6 });
    expect(p.artboards.a2.name).toBe("Two");
    expect(p.artboards.a2.width).toBe(1);
    expect(p.artboards.a2.x).toBe(11);
    expect(ops.updateArtboard(p, "nope", { name: "x" })).toBe(p);
    p = ops.removeArtboard(p, "a2");
    expect(p.artboards.a2).toBeUndefined();
    expect(p.nodes.n1).toBeUndefined();
    expect(p.artboardOrder).toEqual(["a1"]);
    expect(ops.removeArtboard(p, "a2")).toBe(p);
  });
});

describe("node ops", () => {
  it("adds nodes, rounding coordinates and ignoring unknown artboards", () => {
    const p0 = makeProject();
    expect(ops.addNodes(p0, [makeNode("x", "missing")])).toBe(p0);
    const p = ops.addNodes(p0, [makeNode("n1", "a1", { x: 1.4, w: 0 })]);
    expect(p.nodes.n1.x).toBe(1);
    expect(p.nodes.n1.w).toBe(1);
    expect(p.artboards.a1.childOrder).toEqual(["n1"]);
    expect(artboardNodes(p, "a1").map((n) => n.id)).toEqual(["n1"]);
    expect(artboardNodes(p, "zz")).toEqual([]);
    expect(nodeArtboardId(p, "n1")).toBe("a1");
    expect(existingIds(p, ["n1", "zz"])).toEqual(["n1"]);
  });

  it("updates nodes, props and styles", () => {
    let p = withNodes(["n1", "n2"]);
    expect(ops.updateNodes(p, ["zz"], { name: "x" })).toBe(p);
    p = ops.updateNode(p, "n1", { name: "Hello", opacity: 0.5 });
    expect(p.nodes.n1.name).toBe("Hello");
    p = ops.updateNodeProps(p, "n1", { label: "Changed" });
    expect(p.nodes.n1.props.label).toBe("Changed");
    expect(ops.updateNodeProps(p, "zz", {})).toBe(p);
    p = ops.updateNodeStyle(p, ["n1", "n2", "zz"], { colorRole: "danger", radius: 4 });
    expect(p.nodes.n2.style).toEqual({ colorRole: "danger", radius: 4 });
    p = ops.updateNodeStyle(p, ["n1"], { radius: undefined });
    expect(p.nodes.n1.style).toEqual({ colorRole: "danger" });
  });

  it("moves nodes but not locked ones", () => {
    let p = withNodes(["n1", "n2"]);
    p = ops.updateNode(p, "n2", { locked: true });
    expect(ops.moveNodes(p, ["n1"], 0, 0)).toBe(p);
    p = ops.moveNodes(p, ["n1", "n2", "zz"], 5.6, -3);
    expect(p.nodes.n1).toMatchObject({ x: 6, y: -3 });
    expect(p.nodes.n2.x).toBe(10);
  });

  it("sets rects", () => {
    let p = withNodes(["n1", "n2"]);
    p = ops.updateNode(p, "n2", { locked: true });
    p = ops.setNodeRects(p, { n1: { x: 1, y: 2, w: 3.3, h: 4 }, n2: { x: 9, y: 9, w: 9, h: 9 }, zz: { x: 0, y: 0, w: 1, h: 1 } });
    expect(p.nodes.n1).toMatchObject({ x: 1, y: 2, w: 3, h: 4 });
    expect(p.nodes.n2.x).toBe(10);
  });

  it("removes nodes", () => {
    const p0 = withNodes(["n1", "n2", "n3"]);
    expect(ops.removeNodes(p0, ["zz"])).toBe(p0);
    const p = ops.removeNodes(p0, ["n1", "n3"]);
    expect(Object.keys(p.nodes)).toEqual(["n2"]);
    expect(p.artboards.a1.childOrder).toEqual(["n2"]);
  });

  it("duplicates nodes per artboard with offset", () => {
    let p = ops.addArtboard(withNodes(["n1", "n2"]), makeArtboard("a2"));
    p = ops.addNodes(p, [makeNode("m1", "a2")]);
    const r = ops.duplicateNodes(p, ["n2", "m1", "n1"], counterIds("c"));
    expect(r.ids).toEqual(["c1", "c2", "c3"]);
    expect(r.project.nodes.c1).toMatchObject({ artboardId: "a1", x: 16, y: 16 });
    expect(r.project.nodes.c3.artboardId).toBe("a2");
    expect(r.project.artboards.a1.childOrder).toEqual(["n1", "n2", "c1", "c2"]);
  });

  it("clones nodes into another artboard", () => {
    const p = ops.addArtboard(withNodes(["n1"]), makeArtboard("a2"));
    const r = ops.cloneNodesInto(p, [p.nodes.n1], "a2", counterIds("k"), 0);
    expect(r.project.nodes.k1.artboardId).toBe("a2");
    expect(ops.cloneNodesInto(p, [p.nodes.n1], "zz", counterIds()).ids).toEqual([]);
  });
});

describe("z-order", () => {
  const order = ["a", "b", "c", "d"];
  it.each([
    ["forward", ["b"], ["a", "c", "b", "d"]],
    ["forward", ["c", "d"], ["a", "b", "c", "d"]],
    ["backward", ["c"], ["a", "c", "b", "d"]],
    ["backward", ["a", "c"], ["a", "c", "b", "d"]],
    ["front", ["a", "c"], ["b", "d", "a", "c"]],
    ["back", ["b", "d"], ["b", "d", "a", "c"]],
  ] as const)("%s %j", (dir, sel, expected) => {
    expect(ops.reorderList(order, new Set(sel), dir)).toEqual(expected);
  });

  it("reorders nodes in artboards", () => {
    const p = ops.reorderNodes(withNodes(["n1", "n2", "n3"]), ["n1"], "front");
    expect(p.artboards.a1.childOrder).toEqual(["n2", "n3", "n1"]);
  });

  it("moves a node to an index", () => {
    const p0 = withNodes(["n1", "n2", "n3"]);
    expect(ops.moveNodeToIndex(p0, "n3", 0).artboards.a1.childOrder).toEqual(["n3", "n1", "n2"]);
    expect(ops.moveNodeToIndex(p0, "n1", 99).artboards.a1.childOrder).toEqual(["n2", "n3", "n1"]);
    expect(ops.moveNodeToIndex(p0, "zz", 0)).toBe(p0);
  });
});

describe("groups", () => {
  it("groups nodes into a contiguous block at the topmost member", () => {
    const p = ops.groupNodes(withNodes(["n1", "n2", "n3", "n4"]), ["n1", "n3"], "g1");
    expect(p.nodes.n1.parentId).toBe("g1");
    expect(p.nodes.n3.parentId).toBe("g1");
    expect(p.artboards.a1.childOrder).toEqual(["n2", "n1", "n3", "n4"]);
    expect(ops.groupMembers(p, ["n1"]).sort()).toEqual(["n1", "n3"]);
    expect(ops.groupMembers(p, ["n2", "zz"])).toEqual(["n2"]);
  });

  it("needs two members in one artboard", () => {
    const p0 = withNodes(["n1"]);
    expect(ops.groupNodes(p0, ["n1"], "g")).toBe(p0);
    expect(ops.groupNodes(p0, ["zz"], "g")).toBe(p0);
  });

  it("merges existing groups when grouping again", () => {
    let p = ops.groupNodes(withNodes(["n1", "n2", "n3"]), ["n1", "n2"], "g1");
    p = ops.groupNodes(p, ["n1", "n3"], "g2");
    expect(["n1", "n2", "n3"].map((id) => p.nodes[id].parentId)).toEqual(["g2", "g2", "g2"]);
  });

  it("ungroups all members", () => {
    const p0 = ops.groupNodes(withNodes(["n1", "n2"]), ["n1", "n2"], "g1");
    const p = ops.ungroupNodes(p0, ["n2"]);
    expect(p.nodes.n1.parentId).toBeUndefined();
    expect(p.nodes.n2.parentId).toBeUndefined();
    expect(ops.ungroupNodes(p, ["n1"])).toBe(p);
  });

  it("dissolves a group when one member is left", () => {
    const p = ops.removeNodes(ops.groupNodes(withNodes(["n1", "n2"]), ["n1", "n2"], "g1"), ["n1"]);
    expect(p.nodes.n2.parentId).toBeUndefined();
  });

  it("keeps grouping among clones with fresh group ids", () => {
    const p0 = ops.groupNodes(withNodes(["n1", "n2", "n3"]), ["n1", "n2"], "g1");
    const r = ops.duplicateNodes(p0, ["n1", "n2", "n3"], counterIds("c"));
    const clones = r.ids.map((id) => r.project.nodes[id]);
    expect(clones[0].parentId).toBeDefined();
    expect(clones[0].parentId).toBe(clones[1].parentId);
    expect(clones[0].parentId).not.toBe("g1");
    expect(clones[2].parentId).toBeUndefined();
    const single = ops.duplicateNodes(p0, ["n1"], counterIds("s"));
    expect(single.project.nodes[single.ids[0]].parentId).toBeUndefined();
  });
});
