import { describe, expect, it } from "vitest";
import { activeSkin, buildSkinCss, customSkinCss, mergeCustomSkin, skinStructure, skins, structureSkin, wireframe } from "./index";
import { SKIN_IDS } from "../document/types";

describe("skins", () => {
  it("defines every skin with the same var set", () => {
    const keys = Object.keys(buildSkinCss());
    expect(keys.length).toBeGreaterThan(0);
    for (const id of SKIN_IDS) expect(skins[id]).toBeDefined();
  });
  it("emits a css block per skin plus wireframe", () => {
    const css = buildSkinCss();
    expect(css).toContain('.pf-root[data-mode="wireframe"]');
    for (const id of SKIN_IDS) expect(css).toContain(`[data-skin="${id}"]`);
  });
  it("wireframe overrides skin in wireframe mode", () => {
    expect(activeSkin("wireframe", "mui")).toBe(wireframe);
    expect(skinStructure("styled", "mui").inputLabel).toBe("floating");
    expect(skinStructure("wireframe", "mui").inputLabel).toBe("above");
  });
});

describe("custom skin", () => {
  const custom = { name: "Brand", base: "mui" as const, tokens: { primary: "#ff0066", radius: 12 } };
  it("merges overrides onto the base skin", () => {
    const merged = mergeCustomSkin(custom);
    expect(merged.tokens.primary).toBe("#ff0066");
    expect(merged.tokens.text).toBe(skins.mui.tokens.text);
    expect(merged.structure).toBe(skins.mui.structure);
  });
  it("emits a css block for the custom attribute", () => {
    const css = customSkinCss(custom);
    expect(css).toContain('[data-skin="custom"]');
    expect(css).toContain("--pf-primary:#ff0066");
    expect(css).toContain("--pf-radius-base:12px");
  });
  it("resolves the structural skin", () => {
    expect(structureSkin("custom", custom)).toBe("mui");
    expect(structureSkin("custom")).toBe("shadcn");
    expect(structureSkin("antd")).toBe("antd");
  });
});
