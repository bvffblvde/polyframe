import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import uk from "../../../messages/uk.json";
import { COMPONENT_TYPES } from "../document/types";
import { definitions, getDefinition, searchDefinitions, validateProps, type Translator } from "./index";

type Tree = { [k: string]: string | Tree };

function lookup(tree: Tree, key: string): string | undefined {
  let cur: string | Tree | undefined = tree;
  for (const part of key.split(".")) {
    if (typeof cur !== "object") return undefined;
    cur = cur[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

function keys(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string" ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`),
  );
}

function translator(messages: Tree): Translator {
  return (key) => {
    const v = lookup(messages, `defaults.${key}`);
    if (v === undefined) throw new Error(`Missing defaults.${key}`);
    return v;
  };
}

describe("registry", () => {
  it("has a Storybook story for every component", () => {
    for (const type of COMPONENT_TYPES) {
      expect(existsSync(`src/core/registry/components/${type}/${type}.stories.tsx`), type).toBe(true);
    }
  });

  it("registers every component type", () => {
    expect(definitions.map((d) => d.type).sort()).toEqual([...COMPONENT_TYPES].sort());
  });

  it.each([["en", en], ["uk", uk]] as const)("default props are valid in %s", (_, messages) => {
    for (const d of definitions) {
      const props = d.defaultProps(translator(messages as Tree));
      expect(validateProps(d.type, props).success, d.type).toBe(true);
      expect(lookup(messages as Tree, d.labelKey), d.labelKey).toBeTruthy();
      expect(d.minSize.w).toBeLessThanOrEqual(d.defaultSize.w);
      expect(d.minSize.h).toBeLessThanOrEqual(d.defaultSize.h);
      expect(d.keywords.length).toBeGreaterThan(1);
    }
  });

  it("searches by label and keywords in both languages", () => {
    const label = (d: { labelKey: string }) => lookup(en as Tree, d.labelKey) ?? "";
    expect(searchDefinitions("", label)).toHaveLength(definitions.length);
    expect(searchDefinitions("butt", label).map((d) => d.type)).toEqual(["button"]);
    expect(searchDefinitions("кнопка", label).map((d) => d.type)).toEqual(["button"]);
    expect(getDefinition("table").category).toBe("data");
  });
});

describe("messages", () => {
  it("en and uk have the same keys", () => {
    expect(keys(uk as Tree).sort()).toEqual(keys(en as Tree).sort());
  });
  it("contain no long dashes", () => {
    expect(JSON.stringify([en, uk])).not.toMatch(/[\u2013\u2014]/);
  });
});
