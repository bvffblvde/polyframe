import type { ComponentExporters } from "../../../exporters/types";
import type { RatingProps } from "./schema";

const stars = (p: RatingProps, on: string, off: string) =>
  Array.from({ length: p.count }, (_, i) => `<Star className="${i < Math.round(p.value) ? on : off}" />`).join("");

export const ratingExporters: ComponentExporters<RatingProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<div className="flex gap-1">${stars(p, "size-5 fill-amber-400 text-amber-400", "size-5 text-muted-foreground")}</div>`,
    imports: [{ from: "lucide-react", names: ["Star"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Rating defaultValue={${p.value}} max={${p.count}} />`,
    imports: [{ from: "@mui/material", names: ["Rating"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Rating defaultValue={${p.value}} count={${p.count}} />`,
    imports: [{ from: "@mantine/core", names: ["Rating"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Rate defaultValue={${p.value}} count={${p.count}} />`,
    imports: [{ from: "antd", names: ["Rate"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<div className="d-flex gap-1">${stars(p, "text-warning", "text-secondary")}</div>`,
    imports: [{ from: "lucide-react", names: ["Star"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<RatingGroup.Root count={${p.count}} defaultValue={${Math.round(p.value)}} colorPalette="orange"><RatingGroup.HiddenInput /><RatingGroup.Control /></RatingGroup.Root>`,
    imports: [{ from: "@chakra-ui/react", names: ["RatingGroup"] }],
  }),
};
