import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { RenderProps } from "../../types";
import type { AlertProps } from "./schema";

const ICONS: Record<AlertProps["variant"], LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

export function AlertRender({ props }: RenderProps<AlertProps>) {
  const Icon = ICONS[props.variant] ?? Info;
  return (
    <div className="pf-alert" data-variant={props.variant}>
      <Icon className="pf-alert__icon" aria-hidden />
      <div className="pf-alert__content">
        {props.title && <div className="pf-alert__title">{props.title}</div>}
        {props.description && <div className="pf-alert__description">{props.description}</div>}
      </div>
    </div>
  );
}
