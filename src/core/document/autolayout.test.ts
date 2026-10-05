import { describe, expect, it } from "vitest";
import { counterIds, makeNode, makeProject } from "../test/fixtures";
import {
  applyAutoLayout,
  descendants,
  insertionIndex,
  placeInLayout,
  readStackLayout,
  setParent,
  layoutChildren,
  readGridLayout,
  unwrapLayout,
  wrapInGrid,
  wrapInStack,
} from "./autolayout";
import { addNodes, cloneNodesInto, groupMembers, groupNodes, removeNodes, reorderNodes } from "./ops";

const stack = (id: string, props: Record<string, unknown> = {}, rect = { x: 100, y: 100, w: 300, h: 100 }) =>
  makeNode(id, "a1", { type: "stack", ...rect, props: { direction: "row", gap: 10, padding: 0, align: "start", justify: "start", hug: false, ...props } });

function setup() {
  let p = addNodes(makeProject(), [stack("s"), makeNode("a", "a1", { x: 0, y: 0, w: 50, h: 20 }), makeNode("b", "a1", { x: 500, y: 500, w: 40, h: 30 }), makeNode("c")]);
  p = setParent(p, ["a", "b"], "s");
  return applyAutoLayout(p);
}

describe("auto layout", () => {
  it("reads layout props defensively", () => {
    expect(readStackLayout(makeNode("x", "a1", { props: { gap: -3, direction: "x" } }))).toMatchObject({ direction: "column", gap: 0, padding: 0, align: "start", justify: "start", hug: false });
  });

  it("lays out children and keeps them right after the stack", () => {
    const p = setup();
    expect(p.nodes.a).toMatchObject({ x: 100, y: 100 });
    expect(p.nodes.b).toMatchObject({ x: 160, y: 100 });
    expect(p.artboards.a1.childOrder).toEqual(["s", "a", "b", "c"]);
    expect(layoutChildren(p, "s")).toEqual(["a", "b"]);
    expect(applyAutoLayout(p)).toBe(p);
    expect(applyAutoLayout(makeProject())).toEqual(makeProject());
  });

  it("follows the stack when it moves and z-order changes", () => {
    let p = setup();
    p = applyAutoLayout({ ...p, nodes: { ...p.nodes, s: { ...p.nodes.s, x: 0, y: 0 } } });
    expect(p.nodes.b).toMatchObject({ x: 60, y: 0 });
    p = applyAutoLayout(reorderNodes(p, ["s"], "front"));
    expect(p.artboards.a1.childOrder).toEqual(["c", "s", "a", "b"]);
  });

  it("hugs content and nests stacks", () => {
    let p = addNodes(makeProject(), [stack("outer", { direction: "column", hug: true, padding: 4 }), stack("inner", { hug: true }, { x: 0, y: 0, w: 10, h: 10 }), makeNode("x", "a1", { w: 30, h: 30 }), makeNode("y", "a1", { w: 20, h: 10 })]);
    p = setParent(p, ["inner"], "outer");
    p = setParent(p, ["x", "y"], "inner");
    p = applyAutoLayout(p);
    expect(p.nodes.inner).toMatchObject({ w: 60, h: 30, x: 104, y: 104 });
    expect(p.nodes.outer).toMatchObject({ w: 68, h: 38 });
    expect(p.nodes.y).toMatchObject({ x: 144, y: 104 });
    expect(descendants(p, "outer")).toEqual(["inner", "x", "y"]);
    expect(setParent(p, ["outer"], "x")).toBe(p);
    expect(setParent(p, ["outer"], "inner")).toBe(p);
  });

  it("ignores hidden children", () => {
    let p = setup();
    p = applyAutoLayout({ ...p, nodes: { ...p.nodes, a: { ...p.nodes.a, hidden: true } } });
    expect(p.nodes.b.x).toBe(100);
  });

  it("places nodes at an index and detaches them", () => {
    let p = setup();
    expect(insertionIndex(p, "s", { x: 120, y: 0 })).toBe(0);
    expect(insertionIndex(p, "s", { x: 999, y: 0 })).toBe(2);
    p = placeInLayout(p, ["c"], "s", 1);
    expect(layoutChildren(p, "s")).toEqual(["a", "c", "b"]);
    p = placeInLayout(p, ["a"], "s", 99);
    expect(layoutChildren(p, "s")).toEqual(["c", "b", "a"]);
    p = applyAutoLayout(setParent(p, ["c"], undefined));
    expect(p.nodes.c.parentId).toBeUndefined();
    expect(setParent(p, ["c"], undefined)).toBe(p);
    expect(placeInLayout(p, ["zz"], "s", 0)).toBe(p);
  });

  it("wraps a selection in a stack and unwraps it", () => {
    let p = addNodes(makeProject(), [makeNode("a", "a1", { x: 10, y: 10, w: 50, h: 20 }), makeNode("b", "a1", { x: 80, y: 12, w: 40, h: 20 })]);
    p = wrapInStack(p, ["b", "a"], stack("s", {}, { x: 0, y: 0, w: 1, h: 1 }));
    expect(p.nodes.s).toMatchObject({ x: 10, y: 10, w: 110, h: 20, props: { direction: "row", gap: 20, hug: true } });
    expect(layoutChildren(p, "s")).toEqual(["a", "b"]);
    expect(wrapInStack(p, ["zz"], stack("t"))).toBe(p);
    p = unwrapLayout(p, "s");
    expect(p.nodes.s).toBeUndefined();
    expect(p.nodes.a.parentId).toBeUndefined();
    expect(unwrapLayout(p, "a")).toBe(p);
  });

  it("does not treat stack children as groups", () => {
    let p = setup();
    expect(groupMembers(p, ["a"])).toEqual(["a"]);
    p = removeNodes(p, ["b"]);
    expect(p.nodes.a.parentId).toBe("s");
    p = removeNodes(p, ["s"]);
    expect(p.nodes.a.parentId).toBeUndefined();
    const g = groupNodes(setup(), ["a", "c"], "g1");
    expect(g.nodes.a.parentId).toBe("g1");
  });

  it("keeps stack links when cloning", () => {
    const p = setup();
    const both = cloneNodesInto(p, [p.nodes.s, p.nodes.a], "a1", counterIds("k"));
    expect(both.project.nodes.k2.parentId).toBe("k1");
    const child = cloneNodesInto(p, [p.nodes.b], "a1", counterIds("m"));
    expect(child.project.nodes.m1.parentId).toBe("s");
  });
});

describe("grid containers", () => {
  const grid = (id: string, props: Record<string, unknown> = {}) =>
    makeNode(id, "a1", { type: "grid", x: 0, y: 0, w: 220, h: 10, props: { columns: 2, columnGap: 20, rowGap: 10, padding: 0, fill: true, align: "start", hug: true, ...props } });

  it("reads grid props defensively", () => {
    expect(readGridLayout(makeNode("g", "a1", { props: { columns: 40, fill: false } }))).toMatchObject({ columns: 12, columnGap: 16, rowGap: 16, fill: false, hug: true, align: "start" });
  });

  it("lays out children in cells and hugs its height", () => {
    let p = addNodes(makeProject(), [grid("g"), ...["a", "b", "c"].map((id) => makeNode(id, "a1", { w: 50, h: id === "b" ? 40 : 20 }))]);
    p = applyAutoLayout(setParent(p, ["a", "b", "c"], "g"));
    expect(p.nodes.a).toMatchObject({ x: 0, y: 0, w: 100 });
    expect(p.nodes.b).toMatchObject({ x: 120, y: 0, w: 100 });
    expect(p.nodes.c).toMatchObject({ x: 0, y: 50 });
    expect(p.nodes.g.h).toBe(70);
    expect(insertionIndex(p, "g", { x: 150, y: 5 })).toBe(1);
    expect(insertionIndex(p, "g", { x: 10, y: 45 })).toBe(2);
    expect(insertionIndex(p, "g", { x: 200, y: 60 })).toBe(3);
  });

  it("wraps a selection, inferring columns and gaps", () => {
    let p = addNodes(makeProject(), [
      makeNode("a", "a1", { x: 0, y: 0, w: 100, h: 50 }),
      makeNode("b", "a1", { x: 120, y: 0, w: 100, h: 50 }),
      makeNode("c", "a1", { x: 240, y: 0, w: 100, h: 50 }),
      makeNode("d", "a1", { x: 0, y: 70, w: 100, h: 50 }),
    ]);
    p = wrapInGrid(p, ["d", "c", "b", "a"], grid("g"));
    expect(p.nodes.g.props).toMatchObject({ columns: 3, columnGap: 20, rowGap: 20 });
    expect(layoutChildren(p, "g")).toEqual(["a", "b", "c", "d"]);
    expect(p.nodes.d).toMatchObject({ x: 0, y: 70 });
    expect(wrapInGrid(p, ["zz"], grid("h"))).toBe(p);
    expect(unwrapLayout(p, "g").nodes.a.parentId).toBeUndefined();
  });

  it("falls back to three columns when the selection overlaps", () => {
    let p = addNodes(makeProject(), ["a", "b", "c", "d"].map((id, i) => makeNode(id, "a1", { x: 100 + i * 2, y: 100, w: 200, h: 80 })));
    p = wrapInGrid(p, ["a", "b", "c", "d"], grid("g"));
    expect(p.nodes.g).toMatchObject({ w: 632, props: { columns: 3, columnGap: 16, rowGap: 16 } });
    expect(p.nodes.b).toMatchObject({ x: 316, w: 200 });
    expect(p.nodes.d).toMatchObject({ x: 100, y: 196 });
    let edge = addNodes(makeProject(), ["a", "b"].map((id) => makeNode(id, "a1", { x: 1300, y: 0, w: 200, h: 80 })));
    edge = wrapInGrid(edge, ["a", "b"], grid("g"));
    expect(edge.nodes.g).toMatchObject({ x: 1024, w: 416 });
  });
});
