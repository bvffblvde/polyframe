import type { RenderProps } from "../../types";
import { Field, FieldValue } from "./field";
import type { InputProps } from "./schema";

export function InputRender({ props, mode, skin }: RenderProps<InputProps>) {
  return (
    <Field mode={mode} skin={skin} {...props}>
      <FieldValue value={props.value} placeholder={props.placeholder} />
    </Field>
  );
}
