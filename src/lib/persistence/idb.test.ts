import { describe, expect, it } from "vitest";
import { makeProject } from "@/core/test/fixtures";
import { deleteProject, getLastProjectId, listProjects, loadProject, saveProject, setLastProjectId } from "./idb";

describe("idb persistence", () => {
  it("saves, lists, loads and deletes projects", async () => {
    const a = { ...makeProject(), id: "pa", name: "A", updatedAt: "2026-01-01" };
    const b = { ...makeProject(), id: "pb", name: "B", updatedAt: "2026-02-01" };
    await saveProject(a);
    await saveProject(b);
    expect((await listProjects()).map((m) => m.id)).toEqual(["pb", "pa"]);
    expect(await loadProject("pa")).toEqual(a);
    expect(await loadProject("missing")).toBeNull();
    await setLastProjectId("pb");
    expect(await getLastProjectId()).toBe("pb");
    await deleteProject("pb");
    expect((await listProjects()).map((m) => m.id)).toEqual(["pa"]);
  });
});
