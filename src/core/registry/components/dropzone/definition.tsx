import { Upload } from "lucide-react";
import { dropzoneExporters } from "./exporters";
import { dropzoneSvg } from "./svg";
import { defineComponent } from "../../types";
import { DropzoneRender } from "./render";
import { dropzoneSchema } from "./schema";

export const dropzoneDefinition = defineComponent(dropzoneSchema)({
  type: "dropzone",
  category: "inputs",
  labelKey: "components.dropzone",
  keywords: ["dropzone", "upload", "file", "drag and drop", "attachment", "завантаження", "файл", "вкладення"],
  icon: Upload,
  defaultSize: { w: 360, h: 180 },
  minSize: { w: 120, h: 80 },
  defaultProps: (t) => ({ title: t("dropzone.title"), hint: t("dropzone.hint"), actionLabel: t("dropzone.action") }),
  Render: DropzoneRender,
  exporters: dropzoneExporters,
  svg: dropzoneSvg,
});
