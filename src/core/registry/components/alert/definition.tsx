import { TriangleAlert } from "lucide-react";
import { alertExporters } from "./exporters";
import { alertSvg } from "./svg";
import { defineComponent } from "../../types";
import { AlertRender } from "./render";
import { alertSchema } from "./schema";

export const alertDefinition = defineComponent(alertSchema)({
  type: "alert",
  category: "data",
  labelKey: "components.alert",
  keywords: ["alert", "notice", "callout", "message", "banner", "сповіщення", "попередження", "повідомлення"],
  icon: TriangleAlert,
  defaultSize: { w: 400, h: 80 },
  minSize: { w: 80, h: 32 },
  defaultProps: (t) => ({ title: t("alert.title"), description: t("alert.description"), variant: "info" }),
  Render: AlertRender,
  exporters: alertExporters,
  svg: alertSvg,
});
