import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "bench", ".out");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : (args[i + 1] ?? "");
};

const read = (file) => JSON.parse(readFileSync(file, "utf8"));
const parts = Object.fromEntries(
  readdirSync(outDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => [f.replace(/\.json$/, ""), read(path.join(outDir, f))]),
);

const coverageFile = path.join(root, "coverage", "coverage-summary.json");
const coverage = existsSync(coverageFile) ? read(coverageFile).total.lines.pct : undefined;

const editor = Object.values(parts)
  .filter((p) => typeof p.count === "number")
  .sort((a, b) => a.count - b.count);

const results = {
  date: new Date().toISOString().slice(0, 10),
  machine: `${os.cpus()[0]?.model ?? "unknown"}, ${os.platform()}`,
  cpuThrottle: editor[0]?.cpu,
  bundle: parts.bundle,
  editor,
  export500: parts["export-500"],
  badges: {
    editorJsKb: parts.bundle?.editor.jsKb,
    fps1000: editor.find((e) => e.count === 1000)?.drag.fps,
    coverage,
  },
};

const SCENARIOS = ["drag", "marquee", "zoom", "drag100", "pan", "undo"];

function table(r) {
  const lines = [
    `Measured on ${r.machine}, production build, Chromium with ${r.cpuThrottle}x CPU throttling, median of ${r.editor[0]?.runs ?? 1} runs, ${r.date}.`,
    "",
    "| Nodes | Load, ms | Drag FPS, fit | Drag FPS, 100% | Pan FPS, 100% | Marquee FPS | Zoom FPS | Undo 50 steps, ms |",
    "|---:|---:|---:|---:|---:|---:|---:|---:|",
    ...r.editor.map(
      (e) =>
        `| ${e.count} | ${e.loadMs} | ${e.drag.fps} | ${e.drag100?.fps ?? "-"} | ${e.pan?.fps ?? "-"} | ${e.marquee.fps} | ${e.zoom.fps} | ${e.undo.wallMs} |`,
    ),
  ];
  const skin = r.editor.find((e) => e.skin);
  if (skin)
    lines.push("", `Switching through 5 skins on ${skin.count} nodes: ${skin.skin.wallMs} ms.`);
  if (r.bundle) {
    lines.push("", "| Route | JS, KB gzip | Scripts |", "|---|---:|---:|");
    for (const [name, b] of Object.entries(r.bundle))
      lines.push(`| ${name} | ${b.jsKb} | ${b.scripts} |`);
  }
  if (r.export500) {
    const targets = Object.keys(r.export500);
    lines.push(
      "",
      `| Export of 500 nodes, ms | ${targets.join(" | ")} |`,
      `|---|${targets.map(() => "---:").join("|")}|`,
    );
    for (const s of Object.keys(r.export500[targets[0]]))
      lines.push(`| ${s} | ${targets.map((t) => r.export500[t][s]).join(" | ")} |`);
  }
  return lines.join("\n");
}

function compare(base, cur) {
  const fails = [];
  for (const e of cur.editor) {
    const b = base.editor?.find((x) => x.count === e.count);
    if (!b) continue;
    for (const s of SCENARIOS) {
      const was = b[s]?.fps;
      const now = e[s]?.fps;
      if (was && now < was * 0.8 && was - now > 5)
        fails.push(`${e.count} nodes ${s}: ${was} -> ${now} FPS`);
    }
    if (e.loadMs > b.loadMs * 1.2 && e.loadMs - b.loadMs > 200)
      fails.push(`${e.count} nodes load: ${b.loadMs} -> ${e.loadMs} ms`);
  }
  for (const [route, b] of Object.entries(base.bundle ?? {})) {
    const now = cur.bundle?.[route]?.jsKb;
    if (now && now > b.jsKb * 1.1) fails.push(`${route} JS: ${b.jsKb} -> ${now} KB`);
  }
  return fails;
}

const report = table(results);
writeFileSync(path.join(outDir, "report.md"), report + "\n");
if (process.env.GITHUB_STEP_SUMMARY)
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, `## Bench\n\n${report}\n`, { flag: "a" });
console.log(report);

const baselineFile = flag("--baseline");
if (baselineFile !== undefined && existsSync(baselineFile)) {
  const fails = compare(read(baselineFile), results);
  writeFileSync(path.join(outDir, "results.json"), JSON.stringify(results, null, 2) + "\n");
  if (fails.length) {
    console.error(
      `\nRegressions against ${baselineFile}:\n${fails.map((f) => `  ${f}`).join("\n")}`,
    );
    process.exit(1);
  }
  console.log(`\nNo regressions against ${baselineFile}.`);
} else {
  writeFileSync(path.join(outDir, "results.json"), JSON.stringify(results, null, 2) + "\n");
}

if (args.includes("--write")) {
  writeFileSync(path.join(root, "bench", "results.json"), JSON.stringify(results, null, 2) + "\n");
  for (const readme of ["README.md", "README.uk.md"]) {
    const file = path.join(root, readme);
    const text = readFileSync(file, "utf8");
    const next = text.replace(
      /(<!-- bench:start -->\n)[\s\S]*?(\n<!-- bench:end -->)/,
      `$1${report}$2`,
    );
    if (next !== text) writeFileSync(file, next);
  }
  console.log("\nWrote bench/results.json and the README tables.");
}
