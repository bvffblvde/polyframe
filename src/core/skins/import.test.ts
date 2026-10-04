import { describe, expect, it } from "vitest";
import { importTokens } from "./import";

describe("importTokens", () => {
  it("reads shadcn css variables", () => {
    const r = importTokens(`
      :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --primary: oklch(0.6 0.2 260);
        --primary-foreground: #fff;
        --muted-foreground: hsl(215 16% 47%);
        --destructive: #ef4444;
        --radius: 0.5rem;
      }`);
    expect(r?.tokens).toEqual({
      bg: "hsl(0 0% 100%)",
      text: "hsl(222.2 84% 4.9%)",
      primary: "oklch(0.6 0.2 260)",
      primaryFg: "#fff",
      textMuted: "hsl(215 16% 47%)",
      danger: "#ef4444",
      radius: 8,
    });
  });

  it("reads W3C design tokens", () => {
    const r = importTokens(
      JSON.stringify({
        color: { brand: { $value: "#ff0066", $type: "color" }, border: { $value: "#e5e5e5" } },
        font: { family: { $value: "Inter, sans-serif" }, size: { $value: "15px" } },
        borderRadius: { md: { $value: 12 } },
        $description: "ignored",
      }),
    );
    expect(r?.tokens).toEqual({ primary: "#ff0066", border: "#e5e5e5", font: "Inter, sans-serif", fontSize: 15, radius: 12 });
  });

  it("reads Tokens Studio and MUI-like palettes", () => {
    const r = importTokens(
      JSON.stringify({
        global: { primary: { value: "#1976d2", type: "color" }, "control-height": { value: "200px" } },
        palette: { error: { main: "#d32f2f" }, background: { paper: "#fafafa" } },
      }),
    );
    expect(r?.tokens).toMatchObject({ primary: "#1976d2", controlH: 96, danger: "#d32f2f", surface: "#fafafa" });
  });

  it("skips unsafe and unknown values", () => {
    const r = importTokens(JSON.stringify({ primary: "red;}body{x:url(a)", spacing: 4, font: "x{}" }));
    expect(r?.tokens).toEqual({});
    expect(r?.scanned).toBe(3);
    expect(importTokens("{nope")).toBeNull();
    expect(importTokens("   ")).toBeNull();
  });
});
