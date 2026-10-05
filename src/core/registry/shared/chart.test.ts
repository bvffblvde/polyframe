import { describe, expect, it } from "vitest";
import { areaPath, barRects, linePath, linePoints, niceMax, pieSlices, plotArea, seriesMax, ticks } from "./chart";

describe("chart geometry", () => {
  it("rounds axis maximums to nice values", () => {
    expect([0, 7, 12, 23, 260, 999].map(niceMax)).toEqual([1, 8, 15, 25, 300, 1000]);
    expect(ticks(200)).toEqual([0, 50, 100, 150, 200]);
    expect(seriesMax([[10, 30], [45, Number.NaN]])).toBe(50);
    expect(seriesMax([[52]])).toBe(60);
  });

  it("lays out the plot area with room for a legend", () => {
    expect(plotArea(300, 200, false)).toEqual({ x: 40, y: 8, w: 252, h: 168 });
    expect(plotArea(300, 200, true).y).toBe(28);
  });

  it("places grouped bars", () => {
    const bars = barRects({ x: 0, y: 0, w: 100, h: 100 }, 2, [[50, 100], [25]], 100);
    expect(bars).toHaveLength(4);
    expect(bars[0]).toMatchObject({ x: 9, y: 50, h: 50, series: 0, index: 0 });
    expect(bars[1]).toMatchObject({ y: 75, h: 25, series: 1 });
    expect(bars[3]).toMatchObject({ h: 0, index: 1 });
  });

  it("builds straight, smooth and area paths", () => {
    const pts = linePoints({ x: 0, y: 0, w: 100, h: 100 }, [0, 50, 100], 3, 100);
    expect(pts).toEqual([{ x: 0, y: 100 }, { x: 50, y: 50 }, { x: 100, y: 0 }]);
    expect(linePath(pts, false)).toBe("M0 100 L50 50 L100 0");
    expect(linePath(pts, true)).toMatch(/^M0 100 C/);
    expect(areaPath(pts, false, 100)).toBe("M0 100 L50 50 L100 0 L100 100 L0 100 Z");
    expect(linePath([], false)).toBe("");
    expect(areaPath([], false, 0)).toBe("");
    expect(linePoints({ x: 0, y: 0, w: 100, h: 100 }, [5], 1, 10)[0].x).toBe(50);
  });

  it("slices pies and donuts", () => {
    const pie = pieSlices(50, 50, 40, 0, [1, 1, 0, -2]);
    expect(pie.map((s) => s.index)).toEqual([0, 1]);
    expect(pie[0].share).toBe(0.5);
    expect(pie[0].path).toMatch(/L50 50 Z$/);
    expect(pieSlices(50, 50, 40, 20, [3])[0].path).toContain("A20 20");
    expect(pieSlices(50, 50, 40, 0, [0])).toEqual([]);
  });
});
