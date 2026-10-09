import { performance } from "node:perf_hooks";
import { expect, test, type Page } from "@playwright/test";
import { generateProjectCode } from "../src/core/exporters";
import { EXPORT_TARGETS, LAYOUT_STRATEGIES } from "../src/core/exporters/types";
import { benchProject } from "./fixture";
import { installSampler, measure, save, type FrameStats } from "./metrics";

const SIZES = (process.env.BENCH_SIZES ?? "100,500,1000,2000").split(",").map(Number);
const CPU = Number(process.env.BENCH_CPU ?? 4);
const RUNS = Number(process.env.BENCH_RUNS ?? 3);
const SKINS = ["MUI", "Mantine", "Ant Design", "Bootstrap", "shadcn/ui"];

async function openWith(page: Page, count: number) {
  await page.context().addInitScript(() => window.localStorage.setItem("polyframe:tour-done", "1"));
  await page.addInitScript(installSampler);
  await page.goto("/en/editor");
  await expect(page.getByTestId("save-status")).toHaveText("Saved");
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  const started = Date.now();
  await page.getByTestId("import-input").setInputFiles({
    name: "bench.polyframe",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(benchProject(count))),
  });
  await expect(page.locator("[data-export-root] [data-node-id]")).toHaveCount(count, {
    timeout: 120000,
  });
  const loadMs = Date.now() - started;
  await page.keyboard.press("ControlOrMeta+0");
  await page.waitForTimeout(300);
  return loadMs;
}

async function center(page: Page, selector: string) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) throw new Error(`no box for ${selector}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function median(
  run: (i: number) => Promise<FrameStats>,
  by: "fps" | "wallMs" = "fps",
): Promise<FrameStats> {
  const all: FrameStats[] = [];
  for (let i = 0; i < RUNS; i++) all.push(await run(i));
  return all.sort((a, b) => a[by] - b[by])[Math.floor(all.length / 2)];
}

for (const count of SIZES) {
  test(`editor with ${count} nodes`, async ({ page }) => {
    const loadMs = await openWith(page, count);
    const canvas = await page.getByTestId("canvas").boundingBox();
    if (!canvas) throw new Error("no canvas");
    const mid = { x: canvas.x + canvas.width / 2, y: canvas.y + canvas.height / 2 };

    const dragNode = (i: number) =>
      measure(page, async () => {
        const from = await center(page, '[data-node-id="n0"]');
        const dir = i % 2 ? -1 : 1;
        await page.mouse.move(from.x, from.y);
        await page.mouse.down();
        await page.mouse.move(from.x + 300 * dir, from.y + 200 * dir, { steps: 60 });
        await page.mouse.up();
      });

    const drag = await median(dragNode);

    const marquee = await median(() =>
      measure(page, async () => {
        await page.mouse.move(canvas.x + 4, canvas.y + 4);
        await page.mouse.down();
        await page.mouse.move(canvas.x + canvas.width - 4, canvas.y + canvas.height - 4, {
          steps: 30,
        });
        await page.mouse.up();
      }),
    );

    const zoom = await median(() =>
      measure(page, async () => {
        await page.mouse.move(mid.x, mid.y);
        await page.keyboard.down("Control");
        for (let i = 0; i < 20; i++) await page.mouse.wheel(0, i < 10 ? -40 : 40);
        await page.keyboard.up("Control");
      }),
    );

    await page.keyboard.press("ControlOrMeta+1");
    await page.waitForTimeout(300);
    const drag100 = await median(dragNode);
    const pan = await median((i) =>
      measure(page, async () => {
        await page.mouse.move(mid.x, mid.y);
        for (let k = 0; k < 30; k++) await page.mouse.wheel(0, i % 2 ? -120 : 120);
      }),
    );
    await page.keyboard.press("ControlOrMeta+0");
    await page.waitForTimeout(300);

    await page.locator('[data-node-id="n1"]').first().click();
    const undo = await median(async () => {
      for (let i = 0; i < 50; i++) await page.keyboard.press("ArrowRight");
      return measure(page, async () => {
        for (let i = 0; i < 50; i++) await page.keyboard.press("ControlOrMeta+z");
      });
    }, "wallMs");

    let skin: FrameStats | undefined;
    if (count === 500) {
      await page.getByRole("radio", { name: "Styled" }).click();
      skin = await measure(page, async () => {
        for (const name of SKINS) {
          await page.getByTestId("skin-select").click();
          await page.getByRole("option", { name }).click();
        }
        await expect(page.locator("[data-export-root]").first()).toHaveAttribute(
          "data-skin",
          "shadcn",
        );
      });
    }

    save(`editor-${count}`, {
      count,
      cpu: CPU,
      runs: RUNS,
      loadMs,
      drag,
      marquee,
      zoom,
      drag100,
      pan,
      undo,
      ...(skin ? { skin } : {}),
    });
  });
}

test("export time on 500 nodes", () => {
  const project = benchProject(500);
  const result: Record<string, Record<string, number>> = {};
  for (const target of EXPORT_TARGETS) {
    result[target] = {};
    for (const strategy of LAYOUT_STRATEGIES) {
      generateProjectCode(project, target, strategy);
      const t0 = performance.now();
      for (let i = 0; i < 3; i++) generateProjectCode(project, target, strategy);
      result[target][strategy] = Math.round((performance.now() - t0) / 3);
    }
  }
  save("export-500", result);
});

test("bundle size", async ({ browser }) => {
  const routes = { landing: "/en", editor: "/en/editor", docs: "/en/docs" };
  const result: Record<string, { scripts: number; jsKb: number }> = {};
  for (const [name, route] of Object.entries(routes)) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const sizes: Promise<number>[] = [];
    const onResponse = (r: import("@playwright/test").Response) => {
      if (r.request().resourceType() === "script")
        sizes.push(
          r
            .request()
            .sizes()
            .then((s) => s.responseBodySize),
        );
    };
    page.on("response", onResponse);
    await page.goto(route, { waitUntil: "networkidle" });
    await context.close();
    const all = await Promise.all(sizes);
    result[name] = { scripts: all.length, jsKb: Math.round(all.reduce((a, b) => a + b, 0) / 1024) };
  }
  save("bundle", result);
});
