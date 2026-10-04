import type { CustomSkin } from "@/core/document/types";
import { SKIN_IDS } from "@/core/document/types";
import { SKIN_LABELS } from "@/core/skins";

export function skinOptions(custom: CustomSkin | undefined, customLabel: (name: string) => string) {
  const options: { value: string; label: string }[] = SKIN_IDS.map((id) => ({ value: id, label: SKIN_LABELS[id] }));
  if (custom) options.push({ value: "custom", label: customLabel(custom.name) });
  return options;
}
