import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { BoxProps } from "./schema";

export const boxExporters: ComponentExporters<BoxProps> = {
  shadcn: ({ props: p }) => {
    const variant = p.variant === "filled" ? " border-transparent bg-muted" : p.variant === "dashed" ? " border-dashed" : "";
    return {
      jsx: `<div className="flex h-full w-full items-center justify-center rounded-md border${variant} text-sm text-muted-foreground">${text(p.label)}</div>`,
    };
  },
  mui: ({ props: p }) => {
    const sx = [
      'width: "100%"',
      'height: "100%"',
      "borderRadius: 1",
      'display: "flex"',
      'alignItems: "center"',
      'justifyContent: "center"',
      'color: "text.secondary"',
      p.variant === "filled" ? 'bgcolor: "action.hover"' : 'border: 1, borderColor: "divider"',
      p.variant === "dashed" ? 'borderStyle: "dashed"' : "",
    ].filter(Boolean);
    return {
      jsx: `<Box sx={{ ${sx.join(", ")} }}>${text(p.label)}</Box>`,
      imports: [{ from: "@mui/material", names: ["Box"] }],
    };
  },
  mantine: ({ props: p }) => ({
    jsx: `<Center w="100%" h="100%" bdrs="sm" c="dimmed"${p.variant === "filled" ? ' bg="gray.1"' : ` bd="1px ${p.variant === "dashed" ? "dashed" : "solid"} var(--mantine-color-gray-4)"`}>${text(p.label)}</Center>`,
    imports: [{ from: "@mantine/core", names: ["Center"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Flex align="center" justify="center" style={{ width: "100%", height: "100%", borderRadius: 6, color: "rgba(0, 0, 0, 0.45)", ${p.variant === "filled" ? 'background: "rgba(0, 0, 0, 0.04)"' : `border: "1px ${p.variant === "dashed" ? "dashed" : "solid"} #d9d9d9"`} }}>${text(p.label)}</Flex>`,
    imports: [{ from: "antd", names: ["Flex"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<div className="d-flex align-items-center justify-content-center w-100 h-100 rounded text-secondary${p.variant === "filled" ? " bg-body-tertiary" : " border"}"${p.variant === "dashed" ? ' style={{ borderStyle: "dashed" }}' : ""}>${text(p.label)}</div>`,
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Center w="full" h="full" borderRadius="md" color="fg.muted"${p.variant === "filled" ? ' bg="bg.muted"' : ` borderWidth="1px" borderStyle="${p.variant === "dashed" ? "dashed" : "solid"}"`}>${text(p.label)}</Center>`,
    imports: [{ from: "@chakra-ui/react", names: ["Center"] }],
  }),
};
