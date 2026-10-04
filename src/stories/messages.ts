import en from "../../messages/en.json";
import uk from "../../messages/uk.json";
import type { Translator } from "@/core/registry";

type Tree = { [k: string]: string | Tree };
const MESSAGES: Record<"en" | "uk", Tree> = { en: en as Tree, uk: uk as Tree };

export type StoryLocale = keyof typeof MESSAGES;

export function translator(locale: StoryLocale): Translator {
  return (key) => {
    let cur: string | Tree | undefined = MESSAGES[locale];
    for (const part of key.split(".")) cur = typeof cur === "object" ? cur[part] : undefined;
    return typeof cur === "string" ? cur.replace(/\{(\w+)\}/g, "") : key;
  };
}
