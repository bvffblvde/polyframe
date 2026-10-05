import { describe, expect, it } from "vitest";
import { z } from "zod";
import { describeFields, listToText, numbersToText, tableToText, textToList, textToNumbers, textToTable } from "./fields";
import { getDefinition } from "./index";

describe("describeFields", () => {
  it("maps zod types to field kinds", () => {
    const schema = z.object({
      a: z.string(),
      b: z.string().meta({ multiline: true }),
      c: z.number().min(0).max(10),
      d: z.boolean(),
      e: z.enum(["x", "y"]),
      f: z.array(z.string()),
      g: z.array(z.array(z.string())),
      i: z.array(z.number()),
      h: z.date(),
    });
    expect(describeFields(schema)).toEqual([
      { key: "a", kind: "text", multiline: false },
      { key: "b", kind: "text", multiline: true },
      { key: "c", kind: "number", min: 0, max: 10 },
      { key: "d", kind: "boolean" },
      { key: "e", kind: "enum", options: ["x", "y"] },
      { key: "f", kind: "list" },
      { key: "g", kind: "table" },
      { key: "i", kind: "numbers" },
    ]);
    expect(describeFields(z.string())).toEqual([]);
  });

  it("describes real component schemas", () => {
    expect(describeFields(getDefinition("table").propsSchema).map((f) => f.kind)).toEqual([
      "list",
      "table",
      "boolean",
      "boolean",
    ]);
  });
});

describe("text conversions", () => {
  it("round-trips lists and tables", () => {
    expect(textToList(" a \n\n b ")).toEqual(["a", "b"]);
    expect(listToText(["a", "b"])).toBe("a\nb");
    expect(textToTable("a | b\nc|d")).toEqual([["a", "b"], ["c", "d"]]);
    expect(tableToText([["a", "b"]])).toBe("a | b");
    expect(textToNumbers("1, 2.5; x 3\n4")).toEqual([1, 2.5, 3, 4]);
    expect(numbersToText([1, 2])).toBe("1, 2");
  });
});
