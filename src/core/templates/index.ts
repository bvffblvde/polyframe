import { newArtboard } from "../document/factory";
import { addArtboard, addNodes, createProject, updateNodeStyle } from "../document/ops";
import { PRESET_SIZES, type ID, type IdGen, type NodeStyle, type Project } from "../document/types";
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

function fillArtboard(project: Project, template: TemplateDefinition, artboardId: ID, t: Translator, genId: IdGen): Project {
  const tt: Translator = (k) => t(`templates.${k}`);
  const defaults: Translator = (k) => t(`defaults.${k}`);
  const styled: { id: ID; style: NodeStyle }[] = [];
  const nodes = template.build(tt).map((spec) => {
    const node = createNode({ id: genId(), type: spec.type, artboardId, rect: spec, name: t(registry[spec.type].labelKey), t: defaults });
    if (spec.props) node.props = { ...node.props, ...spec.props };
    if (spec.style) styled.push({ id: node.id, style: spec.style });
    return node;
  });
  let next = addNodes(project, nodes);
  for (const s of styled) next = updateNodeStyle(next, [s.id], s.style);
  return next;
}

export function instantiateTemplate(
  template: TemplateDefinition,
  opts: { t: Translator; genId: IdGen; now: string; projectName: string; artboardName: string; projectId?: ID },
): Project {
  const artboard = newArtboard(null, { id: opts.genId(), name: opts.artboardName, preset: template.preset, ...PRESET_SIZES[template.preset] });
  const project = createProject({ id: opts.projectId ?? opts.genId(), name: opts.projectName, now: opts.now, artboard });
  return fillArtboard(project, template, artboard.id, opts.t, opts.genId);
}

export function addTemplateArtboard(
  project: Project,
  template: TemplateDefinition,
  opts: { t: Translator; genId: IdGen; artboardName: string },
): { project: Project; artboardId: ID } {
  const artboard = newArtboard(project, { id: opts.genId(), name: opts.artboardName, preset: template.preset, ...PRESET_SIZES[template.preset] });
  return { project: fillArtboard(addArtboard(project, artboard), template, artboard.id, opts.t, opts.genId), artboardId: artboard.id };
}
