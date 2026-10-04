import type { CSSProperties } from "react";
import { SKIN_IDS, type ComponentType, type Mode, type SkinId } from "@/core/document/types";
import { registry } from "@/core/registry";
import { SKIN_LABELS } from "@/core/skins";
import { ArtboardRoot } from "@/features/editor/canvas/artboard-root";
import { translator, type StoryLocale } from "./messages";

export interface SkinMatrixProps {
  type: ComponentType;
  locale: StoryLocale;
  sketch: boolean;
  props?: Record<string, unknown>;
}

const LOOKS: { mode: Mode; skin: SkinId; label: string }[] = [
  { mode: "wireframe", skin: "shadcn", label: "Wireframe" },
  ...SKIN_IDS.map((skin) => ({ mode: "styled" as const, skin, label: SKIN_LABELS[skin] })),
];

const PAD = 16;

export function SkinMatrix({ type, locale, sketch, props }: SkinMatrixProps) {
  const def = registry[type];
  const t = (k: string) => translator(locale)(`defaults.${k}`);
  const values = { ...def.defaultProps(t), ...props };
  const { w, h } = def.defaultSize;
  const node = { id: type, type, artboardId: "story", name: type, x: PAD, y: PAD, w, h, locked: false, hidden: false, opacity: 1, props: values };
  const Render = def.Render;
  return (
    <div className="sb-matrix" style={{ "--cell-min": `${Math.min(w + PAD * 2, 960)}px` } as CSSProperties}>
      {LOOKS.map((look) => (
        <div key={look.label} className="sb-cell">
          <span className="sb-cell-label">{look.label}</span>
          <ArtboardRoot mode={look.mode} skin={look.skin} sketch={sketch} style={{ width: w + PAD * 2, height: h + PAD * 2 }}>
            <div className="pf-node" style={{ left: PAD, top: PAD, width: w, height: h }}>
              <Render props={values} node={node} mode={look.mode} skin={look.skin} />
            </div>
          </ArtboardRoot>
        </div>
      ))}
    </div>
  );
}
