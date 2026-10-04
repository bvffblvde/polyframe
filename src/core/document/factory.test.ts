import { describe, expect, it } from "vitest";
import { newArtboard } from "./factory";
import { addArtboard } from "./ops";
import { makeProject } from "../test/fixtures";
import { createNode } from "../registry/create-node";

describe("factory", () => {
  it("places new artboards to the right", () => {
    expect(newArtboard(null, { id: "x", name: "X", preset: "mobile" })).toMatchObject({ x: 0, y: 0, width: 390 });
    const p = makeProject();
    const a = newArtboard(p, { id: "a2", name: "Two", preset: "custom" });
    expect(a).toMatchObject({ x: 1440 + 160, y: 0, width: 800, height: 600 });
    const b = newArtboard(addArtboard(p, a), { id: "a3", name: "Three", preset: "tablet", width: 500 });
    expect(b.x).toBe(1600 + 800 + 160);
    expect(b.width).toBe(500);
  });

  it("creates nodes with default props and min size", () => {
    const n = createNode({
      id: "n",
      type: "button",
      artboardId: "a1",
      rect: { x: 1.2, y: 2, w: 1, h: 1 },
      name: "Button",
      t: (k) => k,
    });
    expect(n).toMatchObject({ x: 1, w: 24, h: 20, props: { label: "button.label" } });
  });
});
