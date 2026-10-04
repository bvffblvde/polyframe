import { describe, expect, it } from "vitest";
import { activeSkin, buildSkinCss, skinStructure, skins, wireframe } from "./index";
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
