import { Fragment } from "react";
import type { RenderProps } from "../../types";
import type { StepperProps } from "./schema";

export function StepperRender({ props }: RenderProps<StepperProps>) {
  return (
    <div className="pf-steps">
      {props.steps.map((step, i) => {
        const state = i < props.activeIndex ? "done" : i === props.activeIndex ? "active" : "todo";
        return (
          <Fragment key={i}>
            {i > 0 && <span className="pf-steps__line" data-done={i <= props.activeIndex || undefined} />}
            <span className="pf-steps__step" data-state={state}>
              <span className="pf-steps__dot">{state === "done" ? "✓" : i + 1}</span>
              <span className="pf-steps__label">{step}</span>
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
