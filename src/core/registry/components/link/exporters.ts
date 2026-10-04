import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { LinkProps } from "./schema";

export const linkExporters: ComponentExporters<LinkProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<a href="#" className="font-medium text-primary underline-offset-4 ${p.underline ? "underline" : "hover:underline"}">${text(p.text)}</a>`,
  }),
  mui: ({ props: p }) => ({
    jsx: `<Link href="#" underline="${p.underline ? "always" : "hover"}">${text(p.text)}</Link>`,
    imports: [{ from: "@mui/material", names: ["Link"] }],
  }),
};
