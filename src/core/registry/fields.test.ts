import { describe, expect, it } from "vitest";
import { z } from "zod";
import { describeFields, listToText, tableToText, textToList, textToTable } from "./fields";
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
  });
});
