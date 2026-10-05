import { describe, expect, it } from "vitest";
import { gridHugHeight, hugSize, layoutGrid, layoutStack, type StackLayout } from "./autolayout";

const base: StackLayout = { direction: "row", gap: 10, padding: 5, align: "start", justify: "start", hug: false };
const kids = [
  { w: 20, h: 10 },
  { w: 30, h: 20 },
];

describe("layoutStack", () => {
  it("places children along the main axis", () => {
    expect(layoutStack({ x: 100, y: 100, w: 200, h: 50 }, base, kids)).toEqual([
      { x: 105, y: 105, w: 20, h: 10 },
      { x: 135, y: 105, w: 30, h: 20 },
    ]);
  });

  it("supports columns, center, end and stretch", () => {
    const col = { ...base, direction: "column" as const, align: "center" as const, justify: "end" as const };
    expect(layoutStack({ x: 0, y: 0, w: 50, h: 100 }, col, kids)).toEqual([
      { x: 15, y: 55, w: 20, h: 10 },
      { x: 10, y: 75, w: 30, h: 20 },
    ]);
    const stretch = layoutStack({ x: 0, y: 0, w: 200, h: 50 }, { ...base, align: "stretch", justify: "center" }, kids);
    expect(stretch.map((r) => [r.x, r.h])).toEqual([
      [70, 40],
      [100, 40],
    ]);
    expect(layoutStack({ x: 0, y: 0, w: 200, h: 50 }, { ...base, align: "end" }, kids)[0].y).toBe(35);
  });

  it("spreads children with space between", () => {
    const r = layoutStack({ x: 0, y: 0, w: 110, h: 30 }, { ...base, justify: "between" }, kids);
    expect(r[1].x).toBe(75);
    expect(layoutStack({ x: 0, y: 0, w: 110, h: 30 }, { ...base, justify: "between" }, [kids[0]])[0].x).toBe(5);
  });

  it("computes hug sizes", () => {
    expect(hugSize(base, kids)).toEqual({ w: 70, h: 30 });
    expect(hugSize({ ...base, direction: "column" }, kids)).toEqual({ w: 40, h: 50 });
    expect(hugSize({ ...base, padding: 0 }, [])).toEqual({ w: 1, h: 1 });
  });
});

describe("layoutGrid", () => {
  const grid = { columns: 2, columnGap: 10, rowGap: 6, padding: 5, fill: true, align: "start" as const, hug: true };
  const items = [
    { w: 20, h: 10 },
    { w: 30, h: 20 },
    { w: 40, h: 15 },
  ];

  it("flows children into rows of equal columns", () => {
    expect(layoutGrid({ x: 0, y: 0, w: 110, h: 100 }, grid, items)).toEqual([
      { x: 5, y: 5, w: 45, h: 10 },
      { x: 60, y: 5, w: 45, h: 20 },
      { x: 5, y: 31, w: 45, h: 15 },
    ]);
  });

  it("aligns within rows and keeps widths when not filling", () => {
    const r = layoutGrid({ x: 0, y: 0, w: 110, h: 100 }, { ...grid, fill: false, align: "center" }, items);
    expect(r[0]).toEqual({ x: 5, y: 10, w: 20, h: 10 });
    expect(layoutGrid({ x: 0, y: 0, w: 110, h: 100 }, { ...grid, align: "end" }, items)[0].y).toBe(15);
    expect(layoutGrid({ x: 0, y: 0, w: 110, h: 100 }, { ...grid, align: "stretch" }, items)[0].h).toBe(20);
    expect(layoutGrid({ x: 0, y: 0, w: 110, h: 100 }, { ...grid, columns: 0 }, items).map((x) => x.y)).toEqual([5, 21, 47]);
  });

  it("computes hug height", () => {
    expect(gridHugHeight(grid, items)).toBe(5 + 20 + 6 + 15 + 5);
    expect(gridHugHeight({ ...grid, padding: 0 }, [])).toBe(1);
  });
});
