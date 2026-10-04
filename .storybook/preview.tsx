import type { Preview } from "@storybook/react-vite";
import { buildSkinCss } from "../src/core/skins";
import "../src/styles/canvas.css";
import "./preview.css";

const style = document.createElement("style");
style.textContent = buildSkinCss();
document.head.appendChild(style);

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    a11y: { test: "off" },
  },
};

export default preview;
