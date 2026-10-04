import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { CheckboxProps } from "./schema";

export const checkboxExporters: ComponentExporters<CheckboxProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: `<div className="flex h-full items-center gap-2"><Checkbox id="${ctx.uid}"${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /><Label htmlFor="${ctx.uid}">${text(p.label)}</Label></div>`,
    imports: [
      { from: "@/components/ui/checkbox", names: ["Checkbox"] },
      { from: "@/components/ui/label", names: ["Label"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<FormControlLabel control={<Checkbox${bool("defaultChecked", p.checked)} />} label=${str(p.label)}${bool("disabled", p.disabled)} />`,
    imports: [{ from: "@mui/material", names: ["Checkbox", "FormControlLabel"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Center h="100%" inline><Checkbox label=${str(p.label)}${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /></Center>`,
    imports: [{ from: "@mantine/core", names: ["Center", "Checkbox"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Flex align="center" style={{ height: "100%" }}><Checkbox${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)}>${text(p.label)}</Checkbox></Flex>`,
    imports: [{ from: "antd", names: ["Checkbox", "Flex"] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: `<div className="d-flex align-items-center h-100"><Form.Check type="checkbox" id="${ctx.uid}" label=${str(p.label)}${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /></div>`,
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Flex align="center" h="full"><Checkbox.Root${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)}><Checkbox.HiddenInput /><Checkbox.Control /><Checkbox.Label>${text(p.label)}</Checkbox.Label></Checkbox.Root></Flex>`,
    imports: [{ from: "@chakra-ui/react", names: ["Checkbox", "Flex"] }],
  }),
};
