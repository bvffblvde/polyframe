import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { RenderProps } from "../../types";
import type { ToastProps } from "./schema";

const ICONS: Record<ToastProps["variant"], LucideIcon> = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert };

export function ToastRender({ props }: RenderProps<ToastProps>) {
  const Icon = ICONS[props.variant] ?? Info;
  return (
    <div className="pf-toast" data-variant={props.variant}>
      <Icon className="pf-toast__icon" aria-hidden />
      <span className="pf-toast__text">
        <span className="pf-toast__title">{props.title}</span>
        {props.description && <span className="pf-toast__description">{props.description}</span>}
      </span>
      {props.actionLabel && <span className="pf-toast__action">{props.actionLabel}</span>}
      <span className="pf-toast__close">×</span>
    </div>
  );
}
