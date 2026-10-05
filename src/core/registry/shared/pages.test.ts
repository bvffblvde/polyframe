import { describe, expect, it } from "vitest";
import { pageList } from "./pages";

describe("pageList", () => {
  it("lists every page when there are few", () => {
    expect(pageList(5, 2)).toEqual([1, 2, 3, 4, 5]);
    expect(pageList(0, 3)).toEqual([1]);
  });
  it("collapses distant pages into ellipses", () => {
    expect(pageList(20, 1)).toEqual([1, 2, "ellipsis", 20]);
    expect(pageList(20, 10)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
    expect(pageList(20, 25)).toEqual([1, "ellipsis", 19, 20]);
  });
});
