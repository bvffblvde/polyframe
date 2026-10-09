import { describe, expect, it } from "vitest";
import { parseProjectData } from "@/core/serialization/json";
import { benchProject } from "./fixture";

describe("benchProject", () => {
  it.each([100, 2000])("builds a valid project with %i nodes", (count) => {
    const r = parseProjectData(JSON.parse(JSON.stringify(benchProject(count))));
    expect(r.ok).toBe(true);
    if (r.ok) expect(Object.keys(r.project.nodes)).toHaveLength(count);
  });
});
