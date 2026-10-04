import { newArtboard } from "../document/factory";
import { addNodes, createProject, updateNodeStyle } from "../document/ops";
import { PRESET_SIZES, type ID, type IdGen, type Project } from "../document/types";
import { createNode } from "../registry/create-node";
import { registry } from "../registry";
import type { Translator } from "../registry/types";
import { TEMPLATES } from "./catalog";
import type { TemplateDefinition } from "./types";

export { TEMPLATES };
export type { TemplateDefinition, TemplateNode } from "./types";

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function instantiateTemplate(
  template: TemplateDefinition,
  opts: { t: Translator; genId: IdGen; now: string; projectName: string; artboardName: string; projectId?: ID },
): Project {
  const tt: Translator = (k) => opts.t(`templates.${k}`);
  const defaults: Translator = (k) => opts.t(`defaults.${k}`);
  const artboard = newArtboard(null, {
    id: opts.genId(),
    name: opts.artboardName,
    preset: template.preset,
    ...PRESET_SIZES[template.preset],
  });
  let project = createProject({ id: opts.projectId ?? opts.genId(), name: opts.projectName, now: opts.now, artboard });
  const styled: { id: ID; style: NonNullable<ReturnType<TemplateDefinition["build"]>[number]["style"]> }[] = [];
  const nodes = template.build(tt).map((spec) => {
    const node = createNode({
      id: opts.genId(),
      type: spec.type,
      artboardId: artboard.id,
      rect: spec,
      name: opts.t(registry[spec.type].labelKey),
      t: defaults,
    });
    if (spec.props) node.props = { ...node.props, ...spec.props };
    if (spec.style) styled.push({ id: node.id, style: spec.style });
    return node;
  });
  project = addNodes(project, nodes);
  for (const s of styled) project = updateNodeStyle(project, [s.id], s.style);
  return project;
}
