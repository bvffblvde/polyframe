import { describe, expect, it } from "vitest";
import { daysInMonth, formatDate, isoDate, monthGrid, monthTitle, weekdayNames } from "./calendar";

describe("calendar helpers", () => {
  it("counts days", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 10)).toBe(31);
  });

  it("builds a month grid for both week starts", () => {
    const mon = monthGrid(2026, 10, "monday");
    expect(mon.slice(0, 4)).toEqual([
      { day: 28, inMonth: false },
      { day: 29, inMonth: false },
      { day: 30, inMonth: false },
      { day: 1, inMonth: true },
    ]);
    expect(mon.length % 7).toBe(0);
    expect(monthGrid(2026, 10, "sunday")[4]).toEqual({ day: 1, inMonth: true });
    expect(monthGrid(2026, 1, "monday")[0]).toEqual({ day: 29, inMonth: false });
  });

  it("formats with Intl", () => {
    expect(weekdayNames("en", "sunday")[0]).toBe("Sun");
    expect(weekdayNames("en", "monday")[0]).toBe("Mon");
    expect(monthTitle("en", 2026, 10)).toBe("October 2026");
    expect(formatDate("en", "2026-10-15")).toBe("Oct 15, 2026");
    expect(formatDate("en", "nope")).toBe("");
    expect(isoDate(2026, 3, 7)).toBe("2026-03-07");
  });
});
