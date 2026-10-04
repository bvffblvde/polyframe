import type { ComponentType, ID, Node, Rect } from "../document/types";
import { registry } from "./index";
import type { Translator } from "./types";

export function createNode(opts: {
  id: ID;
  type: ComponentType;
  artboardId: ID;
  rect: Rect;
  name: string;
  t: Translator;
}): Node {
  const def = registry[opts.type];
  return {
    id: opts.id,
    type: opts.type,
    artboardId: opts.artboardId,
    name: opts.name,
    x: Math.round(opts.rect.x),
    y: Math.round(opts.rect.y),
    w: Math.max(def.minSize.w, Math.round(opts.rect.w)),
    h: Math.max(def.minSize.h, Math.round(opts.rect.h)),
    locked: false,
    hidden: false,
    opacity: 1,
    props: def.defaultProps(opts.t),
  };
}
