import type { RenderProps } from "../../types";
import { Field, FieldValue } from "../input/field";
import type { TextareaProps } from "./schema";

export function TextareaRender({ props, mode, skin }: RenderProps<TextareaProps>) {
  return (
    <Field mode={mode} skin={skin} label={props.label} disabled={props.disabled} multiline>
      <FieldValue value={props.value} placeholder={props.placeholder} />
    </Field>
  );
}
