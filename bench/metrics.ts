import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

export interface FrameStats {
  fps: number;
  p95FrameMs: number;
  longTasks: number;
  longTaskMs: number;
  maxEventMs: number;
  wallMs: number;
}

declare global {
  interface Window {
    __bench?: { start: () => void; stop: () => FrameStats };
  }
}

export function installSampler() {
  let frames: number[] = [];
  let longs: number[] = [];
  let events: number[] = [];
  let running = false;
  let gen = 0;
  let t0 = 0;
  let last = 0;
  const loop = (id: number) => {
    const tick = (now: number) => {
      if (!running || id !== gen) return;
      if (last) frames.push(now - last);
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  new PerformanceObserver((l) => {
    if (running) for (const e of l.getEntries()) longs.push(e.duration);
  }).observe({ type: "longtask", buffered: false });
  new PerformanceObserver((l) => {
    if (running) for (const e of l.getEntries()) events.push(e.duration);
  }).observe({ type: "event", durationThreshold: 16, buffered: false } as PerformanceObserverInit);
  window.__bench = {
    start() {
      frames = [];
      longs = [];
      events = [];
      last = 0;
      running = true;
      t0 = performance.now();
      loop(++gen);
    },
    stop() {
      running = false;
      const wallMs = performance.now() - t0;
      const sorted = [...frames].sort((a, b) => a - b);
      const total = frames.reduce((a, b) => a + b, 0);
      return {
        fps: frames.length ? Math.round((frames.length / total) * 10000) / 10 : 0,
        p95FrameMs: Math.round(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
        longTasks: longs.length,
        longTaskMs: Math.round(longs.reduce((a, b) => a + b, 0)),
        maxEventMs: Math.round(Math.max(0, ...events)),
        wallMs: Math.round(wallMs),
      };
    },
  };
}

export async function measure(page: Page, run: () => Promise<void>): Promise<FrameStats> {
  await page.evaluate(() => window.__bench?.start());
  await run();
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
  const stats = await page.evaluate(() => window.__bench?.stop());
  if (!stats) throw new Error("sampler missing");
  return stats;
}

export const OUT_DIR = path.join(process.cwd(), "bench", ".out");

export function save(name: string, data: unknown) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}
