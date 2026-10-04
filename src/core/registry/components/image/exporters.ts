import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { ImageProps } from "./schema";

export const imageExporters: ComponentExporters<ImageProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<div className="relative flex h-full w-full items-center justify-center bg-muted text-muted-foreground${p.rounded ? " rounded-lg" : ""}">`,
      '<ImageIcon className="size-8" />',
      p.caption && `<span className="absolute bottom-2 left-2 text-xs">${text(p.caption)}</span>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "lucide-react", names: ["ImageIcon"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      `<Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "grey.200", color: "text.secondary", display: "flex", alignItems: "center", justifyContent: "center"${p.rounded ? ", borderRadius: 2" : ""} }}>`,
      '<ImageIcon fontSize="large" />',
      p.caption && `<Typography variant="caption" sx={{ position: "absolute", left: 8, bottom: 4 }}>${text(p.caption)}</Typography>`,
      "</Box>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@mui/material", names: ["Box", ...(p.caption ? ["Typography"] : [])] },
      { from: "@mui/icons-material", names: ["Image as ImageIcon"] },
    ],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      `<Center pos="relative" w="100%" h="100%" bg="gray.1" c="dimmed"${p.rounded ? ' bdrs="md"' : ""}>`,
      "<ImageIcon size={32} />",
      p.caption && `<Text size="xs" pos="absolute" left={8} bottom={4}>${text(p.caption)}</Text>`,
      "</Center>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@mantine/core", names: ["Center", ...(p.caption ? ["Text"] : [])] },
      { from: "lucide-react", names: ["ImageIcon"] },
    ],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      `<Flex align="center" justify="center" style={{ position: "relative", width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.04)", color: "rgba(0, 0, 0, 0.25)"${p.rounded ? ", borderRadius: 8" : ""} }}>`,
      "<PictureOutlined style={{ fontSize: 32 }} />",
      p.caption && `<Typography.Text type="secondary" style={{ position: "absolute", left: 8, bottom: 4, fontSize: 12 }}>${text(p.caption)}</Typography.Text>`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "antd", names: ["Flex", ...(p.caption ? ["Typography"] : [])] },
      { from: "@ant-design/icons", names: ["PictureOutlined"] },
    ],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      `<div className="position-relative d-flex align-items-center justify-content-center w-100 h-100 bg-body-secondary text-secondary${p.rounded ? " rounded-3" : ""}">`,
      "<ImageIcon size={32} />",
      p.caption && `<span className="position-absolute bottom-0 start-0 m-2 small">${text(p.caption)}</span>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "lucide-react", names: ["ImageIcon"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Center position="relative" w="full" h="full" bg="bg.muted" color="fg.muted"${p.rounded ? ' borderRadius="lg"' : ""}>`,
      "<ImageIcon size={32} />",
      p.caption && `<Text position="absolute" left="2" bottom="1" textStyle="xs">${text(p.caption)}</Text>`,
      "</Center>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@chakra-ui/react", names: ["Center", ...(p.caption ? ["Text"] : [])] },
      { from: "lucide-react", names: ["ImageIcon"] },
    ],
  }),
};
