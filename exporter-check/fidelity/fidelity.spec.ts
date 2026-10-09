import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { EXPORT_TARGETS } from "../../src/core/exporters/types";
import { instantiateTemplate, TEMPLATES } from "../../src/core/templates";

const require = createRequire(import.meta.url);
const OUT = path.join(process.cwd(), "exporter-check", "fidelity", ".out");
const GENERATED = path.join(process.cwd(), "exporter-check", "generated");
const EXPORT_URL = "http://localhost:5174";
const EDITOR_URL = "http://localhost:3100";

type Tree = { [k: string]: string | Tree };
const en = JSON.parse(
  readFileSync(path.join(process.cwd(), "messages", "en.json"), "utf8"),
) as Tree;
const t = (key: string) => {
  let cur: string | Tree | undefined = en;
  for (const part of key.split(".")) cur = typeof cur === "object" ? cur[part] : undefined;
  return typeof cur === "string" ? cur : key;
};

declare global {
  interface Window {
    axe?: {
      run: (
        ctx: Document,
        opts: object,
      ) => Promise<{
        violations: { id: string; impact?: string | null; nodes: { html: string }[] }[];
      }>;
    };
  }
}

async function editorShot(page: Page, target: string, tplIndex: number) {
  const tpl = TEMPLATES[tplIndex];
  let i = 0;
  const project = instantiateTemplate(tpl, {
    t,
    genId: () => `${tpl.id}${++i}`,
    now: "",
    projectName: tpl.id,
    artboardName: t(`templates.names.${tpl.id}`),
  });
  project.settings = {
    ...project.settings,
    mode: "styled",
    skin: target as typeof project.settings.skin,
    grid: { ...project.settings.grid, visible: false },
  };
  await page.context().addInitScript(() => window.localStorage.setItem("polyframe:tour-done", "1"));
  await page.goto(`${EDITOR_URL}/en/editor`);
  await expect(page.getByTestId("save-status")).toHaveText("Saved");
  await page
    .getByTestId("import-input")
    .setInputFiles({
      name: "t.polyframe",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(project)),
    });
  const root = page.locator(`[data-export-root][data-skin="${target}"]`);
  await expect(root).toBeVisible();
  await page.keyboard.press("ControlOrMeta+1");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(400);
  return root.screenshot({ animations: "disabled" });
}

async function exportShot(
  page: Page,
  target: string,
  file: string,
  size: { width: number; height: number },
) {
  await page.goto(`${EXPORT_URL}/?target=${target}&strategy=absolute&file=${file}`);
  await expect(page.locator("body[data-ready=true]")).toBeAttached({ timeout: 60000 });
  await page.waitForTimeout(400);
  const shot = await page.screenshot({ clip: { x: 0, y: 0, ...size }, animations: "disabled" });
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const axe = await page.evaluate(async () => {
    const r = await window.axe?.run(document, { resultTypes: ["violations"] });
    return (r?.violations ?? [])
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({ id: v.id, html: v.nodes.map((n) => n.html.slice(0, 160)).slice(0, 3) }));
  });
  return { shot, axe };
}

function background(img: PNG) {
  const counts = new Map<number, number>();
  for (let i = 0; i < img.data.length; i += 4 * 7) {
    const key = (img.data[i] << 16) | (img.data[i + 1] << 8) | img.data[i + 2];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const [key] = [...counts].sort((x, y) => y[1] - x[1])[0];
  return [(key >> 16) & 255, (key >> 8) & 255, key & 255];
}

function contentPixels(a: PNG, b: PNG) {
  const bgA = background(a);
  const bgB = background(b);
  const off = (d: Buffer, i: number, bg: number[]) =>
    Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 24;
  let n = 0;
  for (let i = 0; i < a.data.length; i += 4) if (off(a.data, i, bgA) || off(b.data, i, bgB)) n++;
  return n;
}

for (const target of EXPORT_TARGETS) {
  TEMPLATES.forEach((tpl, index) => {
    test(`${target} ${tpl.id}`, async ({ browser }) => {
      const file = readdirSync(path.join(GENERATED, target, "absolute")).find((f) =>
        f.startsWith(`${tpl.id}-`),
      );
      if (!file) throw new Error(`Run the exporter fixtures first: no ${tpl.id} for ${target}`);
      const editor = await browser.newPage();
      const before = PNG.sync.read(await editorShot(editor, target, index));
      await editor.close();
      const page = await browser.newPage();
      const { shot, axe } = await exportShot(page, target, file, {
        width: before.width,
        height: before.height,
      });
      await page.close();
      const after = PNG.sync.read(shot);
      const diff = new PNG({ width: before.width, height: before.height });
      const changed = pixelmatch(before.data, after.data, diff.data, before.width, before.height, {
        threshold: 0.2,
      });
      const diffPct = Math.round((changed / Math.max(1, contentPixels(before, after))) * 1000) / 10;
      mkdirSync(OUT, { recursive: true });
      const base = path.join(OUT, `${target}-${tpl.id}`);
      writeFileSync(`${base}-editor.png`, PNG.sync.write(before));
      writeFileSync(`${base}-export.png`, PNG.sync.write(after));
      writeFileSync(`${base}-diff.png`, PNG.sync.write(diff));
      writeFileSync(
        `${base}.json`,
        JSON.stringify({ target, template: tpl.id, diffPct, axe }, null, 2),
      );
    });
  });
}

for (const target of EXPORT_TARGETS) {
  test(`${target} renders every component without runtime errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(`${EXPORT_URL}/?target=${target}&strategy=absolute&file=all-AllComponents.tsx`);
    await expect(page.locator("body[data-ready=true]")).toBeAttached({ timeout: 60000 });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
}
