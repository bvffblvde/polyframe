import { z } from "zod";
import { COLOR_TOKENS, isSafeCssValue, NUMBER_LIMITS, NUMBER_TOKENS, TEXT_TOKENS } from "../skins/tokens";
import { ARTBOARD_PRESETS, COLOR_ROLES, COMPONENT_TYPES, SKIN_IDS } from "./types";

export const CURRENT_SCHEMA_VERSION = 2;

const int = z.number().int();

const cssValue = z.string().refine(isSafeCssValue, "Unsafe CSS value");

export const customSkinSchema = z.object({
  name: z.string().trim().min(1).max(60),
  base: z.enum(SKIN_IDS),
  tokens: z
    .object({
      ...Object.fromEntries(COLOR_TOKENS.map((k) => [k, cssValue.optional()])),
      ...Object.fromEntries(TEXT_TOKENS.map((k) => [k, cssValue.optional()])),
      ...Object.fromEntries(
        NUMBER_TOKENS.map((k) => [k, z.number().min(NUMBER_LIMITS[k][0]).max(NUMBER_LIMITS[k][1]).optional()]),
      ),
    })
    .strict(),
});

export const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(COMPONENT_TYPES),
  artboardId: z.string().min(1),
  parentId: z.string().optional(),
  name: z.string(),
  x: int,
  y: int,
  w: int.min(1),
  h: int.min(1),
  locked: z.boolean(),
  hidden: z.boolean(),
  opacity: z.number().min(0).max(1),
  style: z
    .object({
      colorRole: z.enum(COLOR_ROLES).optional(),
      radius: int.min(0).max(999).optional(),
      shadow: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
    })
    .optional(),
  props: z.record(z.string(), z.unknown()),
});

export const artboardSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  x: int,
  y: int,
  width: int.min(1).max(10000),
  height: int.min(1).max(10000),
  preset: z.enum(ARTBOARD_PRESETS),
  background: z.string().optional(),
  childOrder: z.array(z.string()),
});

export const projectSchema = z
  .object({
    schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
    id: z.string().min(1),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    settings: z.object({
      mode: z.enum(["wireframe", "styled"]),
      skin: z.enum([...SKIN_IDS, "custom"]),
      customSkin: customSkinSchema.optional(),
      grid: z.object({
        enabled: z.boolean(),
        size: z.union([z.literal(4), z.literal(8), z.literal(16)]),
        visible: z.boolean(),
      }),
      sketchFont: z.boolean(),
    }),
    artboards: z.record(z.string(), artboardSchema),
    artboardOrder: z.array(z.string()),
    nodes: z.record(z.string(), nodeSchema),
  })
  .superRefine((p, ctx) => {
    if (p.settings.skin === "custom" && !p.settings.customSkin) {
      ctx.addIssue({ code: "custom", path: ["settings", "customSkin"], message: "Missing custom skin" });
    }
    for (const id of p.artboardOrder) {
      if (!p.artboards[id]) ctx.addIssue({ code: "custom", path: ["artboardOrder"], message: `Unknown artboard ${id}` });
    }
    for (const [key, a] of Object.entries(p.artboards)) {
      if (a.id !== key) ctx.addIssue({ code: "custom", path: ["artboards", key], message: "Artboard id mismatch" });
      for (const nid of a.childOrder) {
        const n = p.nodes[nid];
        if (!n || n.artboardId !== a.id)
          ctx.addIssue({ code: "custom", path: ["artboards", key, "childOrder"], message: `Invalid node ${nid}` });
      }
    }
    for (const [key, n] of Object.entries(p.nodes)) {
      if (n.id !== key || !p.artboards[n.artboardId]?.childOrder.includes(key))
        ctx.addIssue({ code: "custom", path: ["nodes", key], message: "Orphan node" });
    }
  });
