import type { RenderProps } from "../../types";
import type { AccordionProps } from "./schema";

export function AccordionRender({ props }: RenderProps<AccordionProps>) {
  return (
    <div className="pf-accordion">
      {props.items.map((item, i) => {
        const open = i === props.openIndex;
        return (
          <div key={i} className="pf-accordion__item" data-open={open || undefined}>
            <div className="pf-accordion__trigger">
              <span>{item}</span>
              <span className="pf-accordion__chevron" />
            </div>
            {open && <div className="pf-accordion__content">{props.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
