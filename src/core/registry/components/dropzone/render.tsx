import { Upload } from "lucide-react";
import type { RenderProps } from "../../types";
import { ButtonShape } from "../button/render";
import type { DropzoneProps } from "./schema";

export function DropzoneRender({ props }: RenderProps<DropzoneProps>) {
  return (
    <div className="pf-dropzone">
      <Upload className="pf-dropzone__icon" aria-hidden />
      <span className="pf-dropzone__title">{props.title}</span>
      {props.hint && <span className="pf-dropzone__hint">{props.hint}</span>}
      {props.actionLabel && <ButtonShape label={props.actionLabel} variant="outline" size="sm" />}
    </div>
  );
}
