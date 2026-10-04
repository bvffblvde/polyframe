"use client";

import { useTranslations } from "next-intl";
import type { z } from "zod";
import { describeFields, listToText, tableToText, textToList, textToTable } from "@/core/registry/fields";
import { NumberField, SelectField, SwitchField, TextField } from "./fields";

interface SchemaFormProps {
  schema: z.ZodType;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function SchemaForm({ schema, values, onChange }: SchemaFormProps) {
  const t = useTranslations();
  const label = (key: string) => (t.has(`fields.${key}`) ? t(`fields.${key}`) : key);
  const optionLabel = (v: string) => (t.has(`values.${v}`) ? t(`values.${v}`) : v);
  return (
    <div className="space-y-3">
      {describeFields(schema).map((f) => {
        const v = values[f.key];
        switch (f.kind) {
          case "text":
            return (
              <TextField
                key={f.key}
                label={label(f.key)}
                value={typeof v === "string" ? v : ""}
                multiline={f.multiline}
                onCommit={(s) => onChange(f.key, s)}
                testId={`prop-${f.key}`}
              />
            );
          case "number":
            return (
              <NumberField
                key={f.key}
                label={label(f.key)}
                value={typeof v === "number" ? v : undefined}
                min={f.min}
                max={f.max}
                onCommit={(n) => onChange(f.key, n ?? 0)}
              />
            );
          case "boolean":
            return <SwitchField key={f.key} label={label(f.key)} checked={v === true} onChange={(b) => onChange(f.key, b)} />;
          case "enum":
            return (
              <SelectField
                key={f.key}
                label={label(f.key)}
                value={String(v)}
                options={f.options.map((o) => ({ value: o, label: optionLabel(o) }))}
                onChange={(o) => onChange(f.key, o)}
              />
            );
          case "list":
            return (
              <TextField
                key={f.key}
                label={label(f.key)}
                multiline
                hint={t("inspector.listHint")}
                value={Array.isArray(v) ? listToText(v.map(String)) : ""}
                onCommit={(s) => onChange(f.key, textToList(s))}
              />
            );
          case "table":
            return (
              <TextField
                key={f.key}
                label={label(f.key)}
                multiline
                hint={t("inspector.tableHint")}
                value={Array.isArray(v) ? tableToText(v.map((r) => (Array.isArray(r) ? r.map(String) : []))) : ""}
                onCommit={(s) => onChange(f.key, textToTable(s))}
              />
            );
        }
      })}
    </div>
  );
}
