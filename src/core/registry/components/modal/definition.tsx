import { AppWindow } from "lucide-react";
import { modalExporters } from "./exporters";
import { modalSvg } from "./svg";
import { defineComponent } from "../../types";
import { ModalRender } from "./render";
import { modalSchema } from "./schema";

export const modalDefinition = defineComponent(modalSchema)({
  type: "modal",
  category: "overlays",
  labelKey: "components.modal",
  keywords: ["modal", "dialog", "popup", "confirm", "overlay", "модальне вікно", "діалог", "підтвердження"],
  icon: AppWindow,
  defaultSize: { w: 420, h: 200 },
  minSize: { w: 160, h: 100 },
  defaultProps: (t) => ({ title: t("modal.title"), body: t("modal.body"), confirmLabel: t("modal.confirm"), cancelLabel: t("modal.cancel") }),
  Render: ModalRender,
  exporters: modalExporters,
  svg: modalSvg,
});
