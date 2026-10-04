"use client";

import { useId, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-b px-4 py-4 last:border-b-0">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

function useDraft(value: string) {
  const [draft, setDraft] = useState(value);
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    setDraft(value);
  }
  return [draft, setDraft] as const;
}

interface TextFieldProps {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  multiline?: boolean;
  hint?: string;
  inline?: boolean;
  placeholder?: string;
  testId?: string;
}

export function TextField({ label, value, onCommit, multiline, hint, inline, placeholder, testId }: TextFieldProps) {
  const id = useId();
  const [draft, setDraft] = useDraft(value);
  const commit = () => {
    if (draft !== value) onCommit(draft);
  };
  return (
    <div className={cn(inline ? "flex items-center gap-2" : "space-y-1.5")}>
      <Label htmlFor={id} className={cn(inline && "w-5 shrink-0 text-muted-foreground")}>
        {label}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          value={draft}
          rows={4}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
          }}
          aria-describedby={hint ? `${id}-hint` : undefined}
          data-testid={testId}
        />
      ) : (
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setDraft(value);
          }}
          className="h-8"
          data-testid={testId}
        />
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onCommit: (v: number | undefined) => void;
  min?: number;
  max?: number;
  inline?: boolean;
  allowEmpty?: boolean;
  placeholder?: string;
}

export function NumberField({ label, value, onCommit, min, max, inline, allowEmpty, placeholder }: NumberFieldProps) {
  return (
    <TextField
      label={label}
      inline={inline}
      placeholder={placeholder}
      value={value === undefined ? "" : String(value)}
      onCommit={(raw) => {
        if (raw.trim() === "") {
          if (allowEmpty) onCommit(undefined);
          return;
        }
        const n = Number(raw);
        if (!Number.isFinite(n)) return;
        let v = Math.round(n);
        if (min !== undefined) v = Math.max(min, v);
        if (max !== undefined) v = Math.min(max, v);
        onCommit(v);
      }}
    />
  );
}

export function SwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-8 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
