import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { StatProps } from "./schema";

const arrow = (p: StatProps) => (p.trend === "up" ? "▲" : "▼");

export const statExporters: ComponentExporters<StatProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<Card className="h-full w-full"><CardHeader><CardDescription>${text(p.label)}</CardDescription><CardTitle className="text-3xl tabular-nums">${text(p.value)}</CardTitle>${p.delta ? `<p className="text-sm ${p.trend === "up" ? "text-emerald-600" : "text-red-600"}">${arrow(p)} ${text(p.delta)}</p>` : ""}</CardHeader></Card>`,
    imports: [{ from: "@/components/ui/card", names: ["Card", "CardDescription", "CardHeader", "CardTitle"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Card sx={{ height: "100%" }}><CardContent><Typography variant="overline" color="text.secondary">${text(p.label)}</Typography><Typography variant="h4">${text(p.value)}</Typography>${p.delta ? `<Typography variant="body2" color="${p.trend === "up" ? "success.main" : "error.main"}">${arrow(p)} ${text(p.delta)}</Typography>` : ""}</CardContent></Card>`,
    imports: [{ from: "@mui/material", names: ["Card", "CardContent", "Typography"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Paper withBorder p="md" radius="md" h="100%"><Text size="xs" c="dimmed" tt="uppercase" fw={700}>${text(p.label)}</Text><Text fw={700} fz={28}>${text(p.value)}</Text>${p.delta ? `<Text size="sm" c="${p.trend === "up" ? "teal" : "red"}" fw={500}>${arrow(p)} ${text(p.delta)}</Text>` : ""}</Paper>`,
    imports: [{ from: "@mantine/core", names: ["Paper", "Text"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Card style={{ height: "100%" }}><Statistic title=${str(p.label)} value=${str(p.value)} />${p.delta ? `<Typography.Text type="${p.trend === "up" ? "success" : "danger"}">${arrow(p)} ${text(p.delta)}</Typography.Text>` : ""}</Card>`,
    imports: [{ from: "antd", names: ["Card", "Statistic", ...(p.delta ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<Card className="h-100"><Card.Body><div className="small text-secondary text-uppercase fw-semibold">${text(p.label)}</div><div className="fs-2 fw-bold">${text(p.value)}</div>${p.delta ? `<div className="small ${p.trend === "up" ? "text-success" : "text-danger"}">${arrow(p)} ${text(p.delta)}</div>` : ""}</Card.Body></Card>`,
    imports: [{ from: "react-bootstrap", names: ["Card"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Stat.Root borderWidth="1px" p="4" rounded="md" h="full"><Stat.Label>${text(p.label)}</Stat.Label><Stat.ValueText>${text(p.value)}</Stat.ValueText>${p.delta ? `<Badge colorPalette="${p.trend === "up" ? "green" : "red"}" variant="plain" px="0">${p.trend === "up" ? "<Stat.UpIndicator />" : "<Stat.DownIndicator />"}${text(p.delta)}</Badge>` : ""}</Stat.Root>`,
    imports: [{ from: "@chakra-ui/react", names: ["Stat", ...(p.delta ? ["Badge"] : [])] }],
  }),
};
