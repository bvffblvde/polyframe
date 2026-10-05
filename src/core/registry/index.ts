import type { ComponentType } from "../document/types";
import type { AnyDefinition, Category, Translator } from "./types";
import { alertDefinition } from "./components/alert/definition";
import { avatarDefinition } from "./components/avatar/definition";
import { badgeDefinition } from "./components/badge/definition";
import { boxDefinition } from "./components/box/definition";
import { buttonDefinition } from "./components/button/definition";
import { cardDefinition } from "./components/card/definition";
import { checkboxDefinition } from "./components/checkbox/definition";
import { dividerDefinition } from "./components/divider/definition";
import { headingDefinition } from "./components/heading/definition";
import { iconDefinition } from "./components/icon/definition";
import { imageDefinition } from "./components/image/definition";
import { inputDefinition } from "./components/input/definition";
import { linkDefinition } from "./components/link/definition";
import { navbarDefinition } from "./components/navbar/definition";
import { progressDefinition } from "./components/progress/definition";
import { radioDefinition } from "./components/radio/definition";
import { selectDefinition } from "./components/select/definition";
import { sidebarDefinition } from "./components/sidebar/definition";
import { sliderDefinition } from "./components/slider/definition";
import { stackDefinition } from "./components/stack/definition";
import { switchDefinition } from "./components/switch/definition";
import { tableDefinition } from "./components/table/definition";
import { tabsDefinition } from "./components/tabs/definition";
import { textDefinition } from "./components/text/definition";
import { textareaDefinition } from "./components/textarea/definition";

export const registry: Record<ComponentType, AnyDefinition> = {
  box: boxDefinition,
  card: cardDefinition,
  divider: dividerDefinition,
  navbar: navbarDefinition,
  sidebar: sidebarDefinition,
  button: buttonDefinition,
  input: inputDefinition,
  textarea: textareaDefinition,
  select: selectDefinition,
  checkbox: checkboxDefinition,
  radio: radioDefinition,
  switch: switchDefinition,
  slider: sliderDefinition,
  heading: headingDefinition,
  text: textDefinition,
  link: linkDefinition,
  badge: badgeDefinition,
  image: imageDefinition,
  avatar: avatarDefinition,
  icon: iconDefinition,
  table: tableDefinition,
  tabs: tabsDefinition,
  alert: alertDefinition,
  progress: progressDefinition,
  stack: stackDefinition,
};

export const definitions: AnyDefinition[] = Object.values(registry);

export function getDefinition(type: ComponentType): AnyDefinition {
  return registry[type];
}

export function definitionsByCategory(category: Category): AnyDefinition[] {
  return definitions.filter((d) => d.category === category);
}

export function searchDefinitions(query: string, label: (d: AnyDefinition) => string): AnyDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return definitions;
  return definitions.filter(
    (d) => label(d).toLowerCase().includes(q) || d.keywords.some((k) => k.toLowerCase().includes(q)),
  );
}

export function validateProps(type: ComponentType, props: unknown) {
  return registry[type].propsSchema.safeParse(props);
}

export function createDefaultProps(type: ComponentType, t: Translator): Record<string, unknown> {
  return registry[type].defaultProps(t);
}

export type { AnyDefinition, Category, Translator } from "./types";
export { CATEGORIES } from "./types";
