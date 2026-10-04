import { describe, expect, it } from "vitest";
import { alignRects, distributeRects } from "./align";
import { distanceLabels, snapToGuides } from "./guides";

describe("snapToGuides", () => {
  const target = { x: 100, y: 100, w: 100, h: 50 };

  it("snaps left edge to target edge and returns a guide", () => {
    const r = snapToGuides({ x: 103, y: 300, w: 40, h: 40 }, [target], 5);
    expect(r.dx).toBe(-3);
    expect(r.dy).toBe(0);
    expect(r.lines).toContainEqual({ axis: "x", pos: 100, from: 100, to: 340 });
  });

  it("snaps centers on both axes", () => {
    const r = snapToGuides({ x: 128, y: 103, w: 40, h: 40 }, [target], 5);
    expect(r.dx).toBe(2);
    expect(r.dy).toBe(2);
    expect(r.lines.map((l) => l.axis).sort()).toEqual(["x", "y"]);
  });

  it("ignores targets beyond the threshold", () => {
    expect(snapToGuides({ x: 400, y: 400, w: 10, h: 10 }, [target], 5)).toMatchObject({ dx: 0, dy: 0, lines: [] });
  });

  it("merges equal guide lines", () => {
    const r = snapToGuides({ x: 101, y: 300, w: 10, h: 10 }, [target, { x: 100, y: 0, w: 10, h: 10 }], 5);
    expect(r.lines.filter((l) => l.axis === "x" && l.pos === 100)).toEqual([{ axis: "x", pos: 100, from: 0, to: 310 }]);
  });
});

describe("distanceLabels", () => {
  it("finds the nearest neighbor on each side", () => {
    const m = { x: 100, y: 100, w: 50, h: 50 };
    const labels = distanceLabels(m, [
      { x: 0, y: 110, w: 80, h: 10 },
      { x: 10, y: 110, w: 20, h: 10 },
      { x: 170, y: 100, w: 10, h: 50 },
      { x: 110, y: 0, w: 10, h: 60 },
      { x: 110, y: 180, w: 10, h: 10 },
      { x: 500, y: 500, w: 10, h: 10 },
    ]);
    expect(labels.map((l) => l.value)).toEqual([20, 20, 40, 30]);
  });
});

describe("align and distribute", () => {
  const rects = { a: { x: 0, y: 0, w: 10, h: 10 }, b: { x: 50, y: 20, w: 30, h: 20 } };
  it.each([
    ["left", { a: 0, b: 0 }, "x"],
    ["center", { a: 35, b: 25 }, "x"],
    ["right", { a: 70, b: 50 }, "x"],
    ["top", { a: 0, b: 0 }, "y"],
    ["middle", { a: 15, b: 10 }, "y"],
    ["bottom", { a: 30, b: 20 }, "y"],
  ] as const)("aligns %s", (kind, expected, axis) => {
    const out = alignRects(rects, kind);
    expect(out.a[axis]).toBe(expected.a);
    expect(out.b[axis]).toBe(expected.b);
  });

  it("aligns to a container", () => {
    expect(alignRects(rects, "left", { x: 5, y: 0, w: 100, h: 100 }).b.x).toBe(5);
    expect(alignRects({}, "left")).toEqual({});
  });

  it("distributes with equal gaps", () => {
    const out = distributeRects(
      { a: { x: 0, y: 0, w: 10, h: 10 }, c: { x: 100, y: 0, w: 10, h: 10 }, b: { x: 20, y: 0, w: 30, h: 10 } },
      "x",
    );
    expect(out.b.x).toBe(40);
    const v = distributeRects(
      { a: { x: 0, y: 0, w: 10, h: 10 }, b: { x: 0, y: 5, w: 10, h: 10 }, c: { x: 0, y: 60, w: 10, h: 10 } },
      "y",
    );
    expect(v.b.y).toBe(30);
    expect(distributeRects(rects, "x")).toEqual(rects);
  });
});
