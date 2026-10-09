import { LoaderCircle } from "lucide-react";
import { defineComponent } from "../../types";
import { SpinnerRender } from "./render";
import { spinnerSchema } from "./schema";

export const spinnerDefinition = defineComponent(spinnerSchema)({
  type: "spinner",
  category: "data",
  labelKey: "components.spinner",
  keywords: ["spinner", "loader", "loading", "progress", "busy", "спінер", "завантаження", "індикатор"],
  icon: LoaderCircle,
  defaultSize: { w: 140, h: 36 },
  minSize: { w: 16, h: 16 },
  defaultProps: (t) => ({ label: t("spinner.label"), size: "md" }),
  Render: SpinnerRender,
});
