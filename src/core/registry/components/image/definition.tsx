import { Image } from "lucide-react";
import { imageExporters } from "./exporters";
import { imageSvg } from "./svg";
import { defineComponent } from "../../types";
import { ImageRender } from "./render";
import { imageSchema } from "./schema";

export const imageDefinition = defineComponent(imageSchema)({
  type: "image",
  category: "media",
  labelKey: "components.image",
  keywords: ["image", "picture", "photo", "placeholder", "media", "зображення", "картинка", "фото"],
  icon: Image,
  defaultSize: { w: 320, h: 200 },
  minSize: { w: 16, h: 16 },
  defaultProps: () => ({ caption: "", rounded: false }),
  Render: ImageRender,
  exporters: imageExporters,
  svg: imageSvg,
});
