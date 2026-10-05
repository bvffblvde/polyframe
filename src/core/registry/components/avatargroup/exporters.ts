import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { AvatargroupProps } from "./schema";

const split = (p: AvatargroupProps) => ({ shown: p.initials.slice(0, p.max), rest: Math.max(0, p.initials.length - p.max) });

export const avatargroupExporters: ComponentExporters<AvatargroupProps> = {
  shadcn: ({ props: p }) => {
    const { shown, rest } = split(p);
    return {
      jsx: `<div className="flex -space-x-2">${shown.map((a) => `<Avatar className="ring-2 ring-background"><AvatarFallback>${text(a)}</AvatarFallback></Avatar>`).join("")}${rest ? `<Avatar className="ring-2 ring-background"><AvatarFallback>+${rest}</AvatarFallback></Avatar>` : ""}</div>`,
      imports: [{ from: "@/components/ui/avatar", names: ["Avatar", "AvatarFallback"] }],
    };
  },
  mui: ({ props: p }) => ({
    jsx: `<AvatarGroup max={${p.max + (p.initials.length > p.max ? 1 : 0)}}>${p.initials.map((a) => `<Avatar>${text(a)}</Avatar>`).join("")}</AvatarGroup>`,
    imports: [{ from: "@mui/material", names: ["Avatar", "AvatarGroup"] }],
  }),
  mantine: ({ props: p }) => {
    const { shown, rest } = split(p);
    return {
      jsx: `<Avatar.Group>${shown.map((a) => `<Avatar radius="xl">${text(a)}</Avatar>`).join("")}${rest ? `<Avatar radius="xl">+${rest}</Avatar>` : ""}</Avatar.Group>`,
      imports: [{ from: "@mantine/core", names: ["Avatar"] }],
    };
  },
  antd: ({ props: p }) => ({
    jsx: `<Avatar.Group max={{ count: ${p.max} }}>${p.initials.map((a) => `<Avatar>${text(a)}</Avatar>`).join("")}</Avatar.Group>`,
    imports: [{ from: "antd", names: ["Avatar"] }],
  }),
  bootstrap: ({ props: p }) => {
    const { shown, rest } = split(p);
    const item = (v: string, i: number) =>
      `<span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary-emphasis fw-semibold border border-2 border-white" style={{ width: 40, height: 40${i ? ", marginLeft: -10" : ""} }}>${v}</span>`;
    return { jsx: `<div className="d-flex">${shown.map((a, i) => item(text(a), i)).join("")}${rest ? item(`+${rest}`, 1) : ""}</div>` };
  },
  chakra: ({ props: p }) => {
    const { shown, rest } = split(p);
    return {
      jsx: `<AvatarGroup>${shown.map((a) => `<Avatar.Root><Avatar.Fallback>${text(a)}</Avatar.Fallback></Avatar.Root>`).join("")}${rest ? `<Avatar.Root variant="outline"><Avatar.Fallback>+${rest}</Avatar.Fallback></Avatar.Root>` : ""}</AvatarGroup>`,
      imports: [{ from: "@chakra-ui/react", names: ["Avatar", "AvatarGroup"] }],
    };
  },
};
