import { TextQuote } from "lucide-react";
import { skeletonExporters } from "./exporters";
import { skeletonSvg } from "./svg";
import { defineComponent } from "../../types";
import { SkeletonRender } from "./render";
import { skeletonSchema } from "./schema";

export const skeletonDefinition = defineComponent(skeletonSchema)({
  type: "skeleton",
  category: "data",
  labelKey: "components.skeleton",
  keywords: ["skeleton", "loading", "placeholder", "shimmer", "скелетон", "завантаження", "заглушка"],
  icon: TextQuote,
  defaultSize: { w: 300, h: 72 },
  minSize: { w: 40, h: 16 },
  defaultProps: () => ({ lines: 3, showAvatar: true }),
  Render: SkeletonRender,
  exporters: skeletonExporters,
  svg: skeletonSvg,
});
