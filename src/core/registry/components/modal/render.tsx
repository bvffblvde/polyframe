import type { RenderProps } from "../../types";
import { ButtonShape } from "../button/render";
import type { ModalProps } from "./schema";

export function ModalRender({ props }: RenderProps<ModalProps>) {
  return (
    <div className="pf-modal">
      <div className="pf-modal__header">
        <span className="pf-modal__title">{props.title}</span>
        <span className="pf-modal__close">×</span>
      </div>
      <div className="pf-modal__body">{props.body}</div>
      <div className="pf-modal__footer">
        {props.cancelLabel && <ButtonShape label={props.cancelLabel} variant="outline" size="sm" />}
        {props.confirmLabel && <ButtonShape label={props.confirmLabel} size="sm" />}
      </div>
    </div>
  );
}
