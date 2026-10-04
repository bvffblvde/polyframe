import type { RenderProps } from "../../types";
import { ButtonShape } from "../button/render";
import type { CardProps } from "./schema";

export function CardRender({ props }: RenderProps<CardProps>) {
  return (
    <div className="pf-card">
      {props.title && <div className="pf-card__title">{props.title}</div>}
      {props.body && <div className="pf-card__body">{props.body}</div>}
      {props.showFooter && (
        <div className="pf-card__footer">
          <ButtonShape label={props.actionLabel} size="sm" />
        </div>
      )}
    </div>
  );
}
