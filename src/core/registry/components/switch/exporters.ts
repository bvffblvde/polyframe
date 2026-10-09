import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SwitchProps } from "./schema";

export const switchExporters: ComponentExporters<SwitchProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: `<div className="flex h-full items-center gap-2"><Switch id="${ctx.uid}"${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /><Label htmlFor="${ctx.uid}">${text(p.label)}</Label></div>`,
    imports: [
      { from: "@/components/ui/switch", names: ["Switch"] },
      { from: "@/components/ui/label", names: ["Label"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<FormControlLabel control={<Switch${bool("defaultChecked", p.checked)} />} label=${str(p.label)}${bool("disabled", p.disabled)} />`,
    imports: [{ from: "@mui/material", names: ["FormControlLabel", "Switch"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Center h="100%" inline><Switch label=${str(p.label)}${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /></Center>`,
    imports: [{ from: "@mantine/core", names: ["Center", "Switch"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Flex align="center" gap={8} style={{ height: "100%" }}><Switch aria-label=${str(p.label)}${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /><Typography.Text>${text(p.label)}</Typography.Text></Flex>`,
    imports: [{ from: "antd", names: ["Flex", "Switch", "Typography"] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: `<div className="d-flex align-items-center h-100"><Form.Check type="switch" id="${ctx.uid}" label=${str(p.label)}${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /></div>`,
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Flex align="center" h="full"><Switch.Root${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)}><Switch.HiddenInput /><Switch.Control><Switch.Thumb /></Switch.Control><Switch.Label>${text(p.label)}</Switch.Label></Switch.Root></Flex>`,
    imports: [{ from: "@chakra-ui/react", names: ["Flex", "Switch"] }],
  }),
};
