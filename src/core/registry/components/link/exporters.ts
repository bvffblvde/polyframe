import { bool, text } from "../../../exporters/jsx";
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
  mantine: ({ props: p }) => ({
    jsx: `<Anchor href="#" underline="${p.underline ? "always" : "hover"}">${text(p.text)}</Anchor>`,
    imports: [{ from: "@mantine/core", names: ["Anchor"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Typography.Link href="#"${bool("underline", p.underline)}>${text(p.text)}</Typography.Link>`,
    imports: [{ from: "antd", names: ["Typography"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<a href="#" className="link-primary${p.underline ? "" : " link-underline-opacity-0 link-underline-opacity-100-hover"}">${text(p.text)}</a>`,
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Link href="#" variant="${p.underline ? "underline" : "plain"}" colorPalette="blue">${text(p.text)}</Link>`,
    imports: [{ from: "@chakra-ui/react", names: ["Link"] }],
  }),
};
