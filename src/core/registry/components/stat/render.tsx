import type { RenderProps } from "../../types";
import type { StatProps } from "./schema";

export function StatRender({ props }: RenderProps<StatProps>) {
  return (
    <div className="pf-stat">
      <span className="pf-stat__label">{props.label}</span>
      <span className="pf-stat__value">{props.value}</span>
      {props.delta && (
        <span className="pf-stat__delta" data-trend={props.trend}>
          {props.trend === "up" ? "▲" : "▼"} {props.delta}
        </span>
      )}
    </div>
  );
}
