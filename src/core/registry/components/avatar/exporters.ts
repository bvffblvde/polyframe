import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { AvatarProps } from "./schema";

export const avatarExporters: ComponentExporters<AvatarProps> = {
  shadcn: ({ props: p }) => {
    const r = p.shape === "square" ? " rounded-md" : "";
    return {
      jsx: `<Avatar className="size-full${r}"><AvatarFallback className="${r.trim() || "rounded-full"}">${text(p.initials)}</AvatarFallback></Avatar>`,
      imports: [{ from: "@/components/ui/avatar", names: ["Avatar", "AvatarFallback"] }],
    };
  },
  mui: ({ props: p }) => ({
    jsx: `<Avatar${p.shape === "square" ? ' variant="rounded"' : ""} sx={{ width: "100%", height: "100%" }}>${text(p.initials)}</Avatar>`,
    imports: [{ from: "@mui/material", names: ["Avatar"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Avatar radius="${p.shape === "square" ? "sm" : "xl"}" w="100%" h="100%">${text(p.initials)}</Avatar>`,
    imports: [{ from: "@mantine/core", names: ["Avatar"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Avatar shape="${p.shape}" style={{ width: "100%", height: "100%", fontSize: 18 }}>${text(p.initials)}</Avatar>`,
    imports: [{ from: "antd", names: ["Avatar"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<div className="d-flex align-items-center justify-content-center w-100 h-100 bg-secondary-subtle text-secondary-emphasis fw-semibold ${p.shape === "square" ? "rounded" : "rounded-circle"}">${text(p.initials)}</div>`,
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Avatar.Root shape="${p.shape === "square" ? "rounded" : "full"}" w="full" h="full"><Avatar.Fallback>${text(p.initials)}</Avatar.Fallback></Avatar.Root>`,
    imports: [{ from: "@chakra-ui/react", names: ["Avatar"] }],
  }),
};
