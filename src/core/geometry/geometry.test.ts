import { describe, expect, it } from "vitest";
import { boundsOf, centerRectAt, containsPoint, normalizeRect, offsetRect, rectsIntersect } from "./rect";
import { nudgeStep, snapDelta, snapValue } from "./snap";
import { resizeRect } from "./resize";
import * as vp from "./viewport";
import { intersectRect, nodesInRect } from "./hit-test";
import { makeNode } from "../test/fixtures";

describe("rect", () => {
  it("normalizes, intersects and contains", () => {
    expect(normalizeRect({ x: 10, y: 10 }, { x: 0, y: 5 })).toEqual({ x: 0, y: 5, w: 10, h: 5 });
    expect(rectsIntersect({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 })).toBe(true);
    expect(rectsIntersect({ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
    expect(containsPoint({ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 10 })).toBe(true);
    expect(containsPoint({ x: 0, y: 0, w: 10, h: 10 }, { x: 11, y: 10 })).toBe(false);
  });
  it("computes bounds", () => {
    expect(boundsOf([])).toBeNull();
    expect(boundsOf([{ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: -5, w: 5, h: 5 }])).toEqual({ x: 0, y: -5, w: 25, h: 15 });
  });
  it("offsets and centers", () => {
    expect(offsetRect({ x: 1, y: 1, w: 2, h: 2 }, 1, 2)).toEqual({ x: 2, y: 3, w: 2, h: 2 });
    expect(centerRectAt({ x: 50, y: 50 }, { w: 20, h: 11 })).toEqual({ x: 40, y: 45, w: 20, h: 11 });
  });
});

describe("snap", () => {
  it("snaps values and deltas", () => {
    expect(snapValue(13, 8)).toBe(16);
    expect(snapValue(3.4, 0)).toBe(3);
    expect(snapDelta(5, 6, 8)).toBe(3);
  });
  it("computes nudge steps", () => {
    expect(nudgeStep(false, { enabled: true, size: 8 })).toBe(1);
    expect(nudgeStep(true, { enabled: true, size: 8 })).toBe(8);
    expect(nudgeStep(true, { enabled: false, size: 8 })).toBe(10);
  });
});

describe("resize", () => {
  const s = { x: 100, y: 100, w: 200, h: 100 };
  it("resizes from each edge", () => {
    expect(resizeRect(s, "e", 50, 0)).toEqual({ x: 100, y: 100, w: 250, h: 100 });
    expect(resizeRect(s, "w", 50, 0)).toEqual({ x: 150, y: 100, w: 150, h: 100 });
    expect(resizeRect(s, "n", 0, -20)).toEqual({ x: 100, y: 80, w: 200, h: 120 });
    expect(resizeRect(s, "se", 10, 10)).toEqual({ x: 100, y: 100, w: 210, h: 110 });
  });
  it("respects min size", () => {
    expect(resizeRect(s, "w", 500, 0, { minSize: { w: 20, h: 20 } })).toEqual({ x: 280, y: 100, w: 20, h: 100 });
  });
  it("keeps aspect ratio", () => {
    expect(resizeRect(s, "se", 200, 0, { keepAspect: true })).toEqual({ x: 100, y: 100, w: 400, h: 200 });
    expect(resizeRect(s, "se", 0, 100, { keepAspect: true })).toEqual({ x: 100, y: 100, w: 400, h: 200 });
    expect(resizeRect(s, "e", 200, 0, { keepAspect: true })).toEqual({ x: 100, y: 100, w: 400, h: 200 });
    expect(resizeRect(s, "s", 0, 100, { keepAspect: true })).toEqual({ x: 100, y: 100, w: 400, h: 200 });
    expect(resizeRect(s, "se", -500, 0, { keepAspect: true, minSize: { w: 40, h: 40 } })).toEqual({ x: 100, y: 100, w: 80, h: 40 });
    expect(resizeRect(s, "se", -195, -95, { keepAspect: true, minSize: { w: 10, h: 1 } })).toEqual({ x: 100, y: 100, w: 10, h: 5 });
  });
  it("resizes from center", () => {
    expect(resizeRect(s, "e", 10, 0, { fromCenter: true })).toEqual({ x: 90, y: 100, w: 220, h: 100 });
  });
  it("snaps moving edges", () => {
    expect(resizeRect(s, "se", 13, 13, { snap: 8 })).toEqual({ x: 100, y: 100, w: 212, h: 116 });
    expect(resizeRect(s, "nw", -3, -3, { snap: 8 })).toEqual({ x: 96, y: 96, w: 204, h: 104 });
  });
});

describe("viewport", () => {
  const v = { x: 100, y: 50, zoom: 2 };
  it("converts between screen and world", () => {
    expect(vp.screenToWorld({ x: 120, y: 70 }, v)).toEqual({ x: 10, y: 10 });
    expect(vp.worldToScreen({ x: 10, y: 10 }, v)).toEqual({ x: 120, y: 70 });
  });
  it("zooms at a point keeping it fixed", () => {
    const next = vp.zoomAt(v, 4, { x: 120, y: 70 });
    expect(vp.screenToWorld({ x: 120, y: 70 }, next)).toEqual({ x: 10, y: 10 });
    expect(vp.zoomAt(v, 100, { x: 0, y: 0 }).zoom).toBe(vp.MAX_ZOOM);
    expect(vp.clampZoom(0)).toBe(vp.MIN_ZOOM);
  });
  it("steps zoom", () => {
    expect(vp.stepZoom(1, 1)).toBe(1.25);
    expect(vp.stepZoom(1, -1)).toBe(0.75);
    expect(vp.stepZoom(4, 1)).toBe(4);
    expect(vp.stepZoom(0.1, -1)).toBe(0.1);
  });
  it("fits and centers", () => {
    const f = vp.fitRect({ x: 0, y: 0, w: 1000, h: 500 }, { width: 600, height: 600 }, 50);
    expect(f.zoom).toBe(0.5);
    expect(f.x).toBe(50);
    expect(f.y).toBe(175);
    expect(vp.centerOn({ x: 10, y: 10 }, 1, { width: 100, height: 100 })).toEqual({ zoom: 1, x: 40, y: 40 });
    expect(vp.visibleWorldRect(v, { width: 200, height: 100 })).toEqual({ x: -50, y: -25, w: 100, h: 50 });
  });
});

describe("hit-test", () => {
  it("finds visible unlocked nodes in a rect", () => {
    const nodes = [
      makeNode("a", "a1", { x: 0, y: 0 }),
      makeNode("b", "a1", { x: 500, y: 0 }),
      makeNode("c", "a1", { x: 0, y: 0, locked: true }),
      makeNode("d", "a1", { x: 0, y: 0, hidden: true }),
    ];
    expect(nodesInRect(nodes, { x: -10, y: -10, w: 50, h: 50 })).toEqual(["a"]);
  });
  it("intersects rects", () => {
    expect(intersectRect({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 })).toEqual({ x: 5, y: 5, w: 5, h: 5 });
    expect(intersectRect({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 5, w: 10, h: 10 })).toBeNull();
  });
});
