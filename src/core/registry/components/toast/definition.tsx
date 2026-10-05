import { BellRing } from "lucide-react";
import { toastExporters } from "./exporters";
import { toastSvg } from "./svg";
import { defineComponent } from "../../types";
import { ToastRender } from "./render";
import { toastSchema } from "./schema";

export const toastDefinition = defineComponent(toastSchema)({
  type: "toast",
  category: "overlays",
  labelKey: "components.toast",
  keywords: ["toast", "snackbar", "notification", "message", "тост", "сповіщення", "повідомлення"],
  icon: BellRing,
  defaultSize: { w: 380, h: 72 },
  minSize: { w: 120, h: 40 },
  defaultProps: (t) => ({ title: t("toast.title"), description: t("toast.description"), actionLabel: t("toast.action"), variant: "success" }),
  Render: ToastRender,
  exporters: toastExporters,
  svg: toastSvg,
});
