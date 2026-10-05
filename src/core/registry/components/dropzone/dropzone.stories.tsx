import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkinMatrix } from "@/stories/skin-matrix";

const meta = {
  title: "Canvas/File dropzone",
  component: SkinMatrix,
  args: { type: "dropzone", locale: "en", sketch: false },
  argTypes: {
    type: { control: false },
    locale: { control: "inline-radio", options: ["en", "uk"] },
  },
} satisfies Meta<typeof SkinMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSkins: Story = {};

export const Ukrainian: Story = { args: { locale: "uk" } };

export const SketchFont: Story = { args: { sketch: true } };
