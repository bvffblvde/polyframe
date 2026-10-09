import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), "utf8");
const lastChanged = (file) =>
  execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { cwd: root }).toString().trim();
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
};
const tableRows = (markdown) =>
  markdown
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*-/.test(line) && !/^\|---/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );

const bench = JSON.parse(read("bench/results.json"));
const at = (count) => bench.editor.find((row) => row.count === count);

const fidelityMd = read("docs/FIDELITY.md");
const [header, ...cells] = tableRows(fidelityMd.split("## Accessibility")[0]);
const templates = header.slice(1, -1);
const diffs = cells.flatMap((row) => row.slice(1, -1).map((cell) => Number.parseFloat(cell)));
const withinThresholds = cells.every((row) => {
  const limit = Number.parseFloat(row.at(-1));
  return row.slice(1, -1).every((cell) => Number.parseFloat(cell) <= limit);
});

const historyMd = read("bench/HISTORY.md");
const firstEntry = historyMd.split(/\n## /)[1] ?? "";
const historyDate = firstEntry.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
const history = tableRows(firstEntry)
  .slice(1)
  .map(([scenario, before, after]) => {
    const unit = before.replace(/[\d.\s]/g, "");
    return { scenario, before: Number.parseFloat(before), after: Number.parseFloat(after), unit };
  });

const metrics = {
  v: 1,
  bench: {
    date: bench.date,
    cpuThrottle: bench.cpuThrottle,
    editorInitialJsKb: bench.bundle.editor.jsKb,
    landingInitialJsKb: bench.bundle.landing.jsKb,
    nodes1000: {
      loadMs: at(1000).loadMs,
      dragFps: at(1000).drag.fps,
      dragAt100ZoomFps: at(1000).drag100.fps,
      panFps: at(1000).pan.fps,
    },
    nodes2000: {
      loadMs: at(2000).loadMs,
      dragAt100ZoomFps: at(2000).drag100.fps,
      panFps: at(2000).pan.fps,
    },
  },
  fidelity: {
    date: lastChanged("docs/FIDELITY.md"),
    targets: cells.length,
    templates: templates.length,
    exports: diffs.length,
    medianDiffPct: median(diffs),
    maxDiffPct: Math.max(...diffs),
    withinThresholds,
    exporterA11yViolations: /None that the exporter controls/.test(fidelityMd) ? 0 : null,
  },
  coverage: {
    date: bench.date,
    scope: "document ops, auto-layout and geometry",
    linesPct: bench.badges.coverage,
  },
  history: { date: historyDate, rows: history },
};

writeFileSync(path.join(root, "docs", "metrics.json"), JSON.stringify(metrics, null, 2) + "\n");
console.log(
  `docs/metrics.json: ${metrics.fidelity.exports} exports, ${history.length} history rows`,
);
