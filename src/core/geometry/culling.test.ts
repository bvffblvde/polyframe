import { describe, expect, it } from "vitest";
import { makeNode } from "../test/fixtures";
import { CULL_MIN_NODES, cullWindow, nextCullRect, sameRect, visibleNodeIds } from "./culling";

describe("cullWindow", () => {
  it("covers the view with half a view of margin, snapped to tiles", () => {
    expect(cullWindow({ x: 0, y: 0, zoom: 1 }, { width: 1000, height: 500 }, 100)).toEqual({
      x: -500,
      y: -300,
      w: 2000,
      h: 1100,
    });
  });

  it("scales with zoom and pan", () => {
    const w = cullWindow({ x: -2000, y: 0, zoom: 2 }, { width: 1000, height: 1000 }, 100);
    expect(w).toEqual({ x: 700, y: -300, w: 1100, h: 1100 });
  });

  it("stays the same for small pans inside a tile", () => {
    const view = { width: 800, height: 600 };
    expect(cullWindow({ x: -10, y: -10, zoom: 1 }, view)).toEqual(
      cullWindow({ x: -20, y: -15, zoom: 1 }, view),
    );
  });
});

describe("visibleNodeIds", () => {
  const many = Array.from({ length: CULL_MIN_NODES }, (_, i) =>
    makeNode(`n${i}`, "a1", { x: i * 100, y: 0, w: 50, h: 50 }),
  );
  const nodes = Object.fromEntries(many.map((n) => [n.id, n]));
  const order = many.map((n) => n.id);

  const board = { x: 0, y: 0, width: CULL_MIN_NODES * 100, height: 100 };

  it("keeps the same order when nothing is culled", () => {
    expect(
      visibleNodeIds(order.slice(0, 10), nodes, board, { x: 0, y: 0, w: 1, h: 1 }),
    ).toHaveLength(10);
    expect(visibleNodeIds(order, nodes, board, null)).toBe(order);
    expect(
      visibleNodeIds(order, nodes, board, { x: -10, y: -10, w: board.width + 20, h: 200 }),
    ).toBe(order);
  });

  it("filters by the window in artboard coordinates and keeps order", () => {
    expect(
      visibleNodeIds(order, nodes, { ...board, x: 1000 }, { x: 1000, y: 0, w: 260, h: 100 }),
    ).toEqual(["n0", "n1", "n2"]);
  });
});

describe("nextCullRect", () => {
  const a = { x: 0, y: 0, w: 100, h: 100 };
  const b = { x: 50, y: 0, w: 100, h: 100 };

  it("applies the first or a cleared window right away", () => {
    expect(nextCullRect(null, a)).toEqual({ now: a, settle: false });
    expect(nextCullRect(a, null)).toEqual({ now: null, settle: false });
  });

  it("grows at once and shrinks later", () => {
    expect(nextCullRect(a, b)).toEqual({ now: { x: 0, y: 0, w: 150, h: 100 }, settle: true });
    expect(nextCullRect({ x: 0, y: 0, w: 150, h: 100 }, b).settle).toBe(true);
    expect(nextCullRect(a, { x: -10, y: -10, w: 200, h: 200 })).toEqual({
      now: { x: -10, y: -10, w: 200, h: 200 },
      settle: false,
    });
  });

  it("compares rects by value", () => {
    expect(sameRect(a, { ...a })).toBe(true);
    expect(sameRect(a, b)).toBe(false);
    expect(sameRect(null, null)).toBe(true);
  });
});
