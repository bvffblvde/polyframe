import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../../../../messages/en.json";
import { getDefinition } from "@/core/registry";
import { SchemaForm } from "./schema-form";

function setup(type: Parameters<typeof getDefinition>[0], values: Record<string, unknown>) {
  const onChange = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SchemaForm schema={getDefinition(type).propsSchema} values={values} onChange={onChange} />
    </NextIntlClientProvider>,
  );
  return onChange;
}

describe("SchemaForm", () => {
  afterEach(cleanup);

  it("renders a control per schema field with translated labels", () => {
    setup("button", { label: "Go", variant: "solid", size: "md", disabled: false });
    expect(screen.getByLabelText("Label")).toHaveValue("Go");
    expect(screen.getByRole("combobox", { name: "Variant" })).toHaveTextContent("Solid");
    expect(screen.getByRole("combobox", { name: "Size" })).toHaveTextContent("Medium");
    expect(screen.getByRole("switch", { name: "Disabled" })).not.toBeChecked();
  });

  it("commits text on blur and toggles booleans immediately", () => {
    const onChange = setup("button", { label: "Go", variant: "solid", size: "md", disabled: false });
    const input = screen.getByLabelText("Label");
    fireEvent.change(input, { target: { value: "Sign up" } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith("label", "Sign up");
    fireEvent.click(screen.getByRole("switch", { name: "Disabled" }));
    expect(onChange).toHaveBeenCalledWith("disabled", true);
  });

  it("edits lists and tables as text", () => {
    const onChange = setup("table", { columns: ["A", "B"], rows: [["1", "2"]], striped: false, bordered: false });
    const rows = screen.getByLabelText("Rows");
    expect(rows).toHaveValue("1 | 2");
    fireEvent.change(rows, { target: { value: "1 | 2\n3 | 4" } });
    fireEvent.blur(rows);
    expect(onChange).toHaveBeenCalledWith("rows", [["1", "2"], ["3", "4"]]);
    const cols = screen.getByLabelText("Columns");
    fireEvent.change(cols, { target: { value: "A\nB\nC" } });
    fireEvent.blur(cols);
    expect(onChange).toHaveBeenCalledWith("columns", ["A", "B", "C"]);
  });

  it("clamps numbers to schema bounds", () => {
    const onChange = setup("progress", { label: "", value: 10, showValue: true });
    const value = screen.getByLabelText("Value");
    fireEvent.change(value, { target: { value: "250" } });
    fireEvent.keyDown(value, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("value", 100);
  });
});
