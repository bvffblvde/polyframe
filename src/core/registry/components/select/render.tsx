import type { RenderProps } from "../../types";
import { Field, FieldValue } from "../input/field";
import type { SelectProps } from "./schema";

export function SelectRender({ props, mode, skin }: RenderProps<SelectProps>) {
  return (
    <Field mode={mode} skin={skin} label={props.label} disabled={props.disabled}>
      <FieldValue value={props.value} placeholder={props.placeholder} />
      <span className="pf-select__chevron" />
    </Field>
  );
}
