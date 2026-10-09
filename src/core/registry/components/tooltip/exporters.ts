import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { TooltipProps } from "./schema";

export const tooltipExporters: ComponentExporters<TooltipProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<TooltipProvider><Tooltip open><TooltipTrigger asChild><Button variant="outline" size="sm">${text(p.trigger)}</Button></TooltipTrigger><TooltipContent side="${p.placement}">${text(p.text)}</TooltipContent></Tooltip></TooltipProvider>`,
    imports: [
      { from: "@/components/ui/tooltip", names: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"] },
      { from: "@/components/ui/button", names: ["Button"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Tooltip title=${str(p.text)} open arrow placement="${p.placement}"><Button variant="outlined" size="small">${text(p.trigger)}</Button></Tooltip>`,
    imports: [{ from: "@mui/material", names: ["Button", "Tooltip"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Tooltip label=${str(p.text)} opened withArrow position="${p.placement}"><Button variant="default" size="xs">${text(p.trigger)}</Button></Tooltip>`,
    imports: [{ from: "@mantine/core", names: ["Button", "Tooltip"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Tooltip title=${str(p.text)} open placement="${p.placement}"><Button size="small">${text(p.trigger)}</Button></Tooltip>`,
    imports: [{ from: "antd", names: ["Button", "Tooltip"] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: `<OverlayTrigger show placement="${p.placement}" overlay={<Tooltip id="${ctx.uid}">${text(p.text)}</Tooltip>}><Button variant="outline-secondary" size="sm">${text(p.trigger)}</Button></OverlayTrigger>`,
    imports: [{ from: "react-bootstrap", names: ["Button", "OverlayTrigger", "Tooltip"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Tooltip.Root open positioning={{ placement: "${p.placement}" }}><Tooltip.Trigger asChild><Button variant="outline" size="sm">${text(p.trigger)}</Button></Tooltip.Trigger><Portal><Tooltip.Positioner><Tooltip.Content><Tooltip.Arrow><Tooltip.ArrowTip /></Tooltip.Arrow>${text(p.text)}</Tooltip.Content></Tooltip.Positioner></Portal></Tooltip.Root>`,
    imports: [{ from: "@chakra-ui/react", names: ["Button", "Portal", "Tooltip"] }],
  }),
};
