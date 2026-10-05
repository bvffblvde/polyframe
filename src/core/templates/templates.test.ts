import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import uk from "../../../messages/uk.json";
import { projectSchema } from "../document/schema";
import { validateProps } from "../registry";
import { counterIds } from "../test/fixtures";
import { addTemplateArtboard, getTemplate, instantiateTemplate, TEMPLATES } from "./index";

type Tree = { [k: string]: string | Tree };

function translator(messages: Tree) {
  return (key: string) => {
    let cur: string | Tree | undefined = messages;
    for (const part of key.split(".")) cur = typeof cur === "object" ? cur[part] : undefined;
    if (typeof cur !== "string") throw new Error(`Missing ${key}`);
    return cur;
  };
}

describe("templates", () => {
  it("has the six starter templates", () => {
    expect(TEMPLATES.map((t) => t.id)).toEqual(["login", "dashboard", "landing", "settings", "pricing", "mobileProfile"]);
    expect(getTemplate("pricing")?.preset).toBe("desktop");
    expect(getTemplate("nope")).toBeUndefined();
  });

  it.each(TEMPLATES.flatMap((tpl) => [["en", tpl.id, en], ["uk", tpl.id, uk]] as const))(
    "%s %s builds a valid project inside its artboard",
    (_, id, messages) => {
      const tpl = getTemplate(id);
      if (!tpl) throw new Error(id);
      const t = translator(messages as Tree);
      const p = instantiateTemplate(tpl, {
        t,
        genId: counterIds(),
        now: "2026-01-01T00:00:00.000Z",
        projectName: t(`templates.names.${id}`),
        artboardName: "A",
      });
      expect(projectSchema.safeParse(p).success).toBe(true);
      const a = p.artboards[p.artboardOrder[0]];
      for (const n of Object.values(p.nodes)) {
        expect(validateProps(n.type, n.props).success, `${id} ${n.type}`).toBe(true);
        expect(n.x + n.w, `${id} ${n.type}`).toBeLessThanOrEqual(a.width);
        expect(n.y + n.h, `${id} ${n.type}`).toBeLessThanOrEqual(a.height);
      }
    },
  );
});

describe("addTemplateArtboard", () => {
  it("adds a template as a new artboard to the right of existing ones", () => {
    const t = translator(en as Tree);
    const base = instantiateTemplate(TEMPLATES[0], { t, genId: counterIds("a"), now: "", projectName: "P", artboardName: "One" });
    const tpl = getTemplate("mobileProfile");
    if (!tpl) throw new Error("template");
    const { project, artboardId } = addTemplateArtboard(base, tpl, { t, genId: counterIds("b"), artboardName: "Profile" });
    expect(project.artboardOrder).toEqual([...base.artboardOrder, artboardId]);
    const first = project.artboards[base.artboardOrder[0]];
    expect(project.artboards[artboardId]).toMatchObject({ name: "Profile", preset: "mobile", x: first.x + first.width + 160 });
    expect(project.artboards[artboardId].childOrder.length).toBeGreaterThan(5);
    expect(projectSchema.safeParse(project).success).toBe(true);
  });
});
