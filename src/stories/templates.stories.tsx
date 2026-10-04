import type { Meta, StoryObj } from "@storybook/react-vite";
import { SKIN_IDS, type Mode, type SkinId } from "@/core/document/types";
import { registry } from "@/core/registry";
import { instantiateTemplate, TEMPLATES } from "@/core/templates";
import { ArtboardRoot } from "@/features/editor/canvas/artboard-root";
import { translator, type StoryLocale } from "./messages";

interface TemplatePreviewProps {
  template: string;
  locale: StoryLocale;
  mode: Mode;
  skin: SkinId;
  scale: number;
}

function TemplatePreview({ template, locale, mode, skin, scale }: TemplatePreviewProps) {
  const tpl = TEMPLATES.find((x) => x.id === template) ?? TEMPLATES[0];
  let i = 0;
  const p = instantiateTemplate(tpl, { t: translator(locale), genId: () => `s${++i}`, now: "", projectName: "", artboardName: "" });
  const a = p.artboards[p.artboardOrder[0]];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ width: a.width * scale, height: a.height * scale, overflow: "hidden" }}>
        <ArtboardRoot mode={mode} skin={skin} style={{ width: a.width, height: a.height, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          {a.childOrder.map((id) => {
            const n = p.nodes[id];
            const Render = registry[n.type].Render;
            return (
              <div key={id} className="pf-node" data-role={n.style?.colorRole} data-shadow={n.style?.shadow} style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
                <Render props={n.props} node={n} mode={mode} skin={skin} />
              </div>
            );
          })}
        </ArtboardRoot>
      </div>
    </div>
  );
}

const meta = {
  title: "Templates/Preview",
  component: TemplatePreview,
  args: { template: "login", locale: "en", mode: "styled", skin: "shadcn", scale: 0.6 },
  argTypes: {
    template: { control: "select", options: TEMPLATES.map((t) => t.id) },
    locale: { control: "inline-radio", options: ["en", "uk"] },
    mode: { control: "inline-radio", options: ["wireframe", "styled"] },
    skin: { control: "select", options: SKIN_IDS },
    scale: { control: { type: "range", min: 0.2, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof TemplatePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {};
export const Dashboard: Story = { args: { template: "dashboard", scale: 0.5 } };
export const MobileProfile: Story = { args: { template: "mobileProfile", scale: 0.8, skin: "mui" } };
