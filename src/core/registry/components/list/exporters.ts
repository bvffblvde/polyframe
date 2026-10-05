import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import { at, initialsOf } from "../../shared/text";
import type { ListProps } from "./schema";

const rows = (p: ListProps) => p.items.map((item, i) => ({ item, sub: at(p.secondary, i, ""), initials: initialsOf(item) }));

export const listExporters: ComponentExporters<ListProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<ul className="rounded-md border${p.dividers ? " divide-y" : ""}">`,
      ...rows(p).map(
        (r) =>
          `<li className="flex items-center gap-3 p-3">${p.showAvatar ? `<Avatar><AvatarFallback>${r.initials}</AvatarFallback></Avatar>` : ""}<div><p className="text-sm font-medium leading-none">${text(r.item)}</p>${r.sub ? `<p className="mt-1 text-sm text-muted-foreground">${text(r.sub)}</p>` : ""}</div></li>`,
      ),
      "</ul>",
    ].join("\n"),
    imports: p.showAvatar ? [{ from: "@/components/ui/avatar", names: ["Avatar", "AvatarFallback"] }] : [],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      "<List>",
      ...rows(p).map(
        (r) =>
          `<ListItem${p.dividers ? " divider" : ""}>${p.showAvatar ? `<ListItemAvatar><Avatar>${r.initials}</Avatar></ListItemAvatar>` : ""}<ListItemText primary=${str(r.item)}${r.sub ? ` secondary=${str(r.sub)}` : ""} /></ListItem>`,
      ),
      "</List>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["List", "ListItem", "ListItemText", ...(p.showAvatar ? ["Avatar", "ListItemAvatar"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Stack gap="sm">',
      ...rows(p).flatMap((r, i) => [
        i > 0 && p.dividers ? "<Divider />" : "",
        `<Group gap="sm" wrap="nowrap">${p.showAvatar ? `<Avatar radius="xl">${r.initials}</Avatar>` : ""}<div><Text size="sm" fw={500}>${text(r.item)}</Text>${r.sub ? `<Text size="sm" c="dimmed">${text(r.sub)}</Text>` : ""}</div></Group>`,
      ]),
      "</Stack>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mantine/core", names: ["Group", "Stack", "Text", ...(p.dividers ? ["Divider"] : []), ...(p.showAvatar ? ["Avatar"] : [])] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<List itemLayout="horizontal"${p.dividers ? "" : " split={false}"} dataSource={${JSON.stringify(rows(p).map((r) => ({ title: r.item, description: r.sub, initials: r.initials })))}} renderItem={(item) => <List.Item><List.Item.Meta${p.showAvatar ? " avatar={<Avatar>{item.initials}</Avatar>}" : ""} title={item.title} description={item.description} /></List.Item>} />`,
    imports: [{ from: "antd", names: ["List", ...(p.showAvatar ? ["Avatar"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      `<ListGroup${p.dividers ? "" : ' variant="flush"'}>`,
      ...rows(p).map(
        (r) =>
          `<ListGroup.Item className="d-flex align-items-center gap-3">${p.showAvatar ? `<span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle fw-semibold" style={{ width: 40, height: 40 }}>${r.initials}</span>` : ""}<div><div className="fw-medium">${text(r.item)}</div>${r.sub ? `<small className="text-secondary">${text(r.sub)}</small>` : ""}</div></ListGroup.Item>`,
      ),
      "</ListGroup>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["ListGroup"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Stack gap="0">',
      ...rows(p).map(
        (r) =>
          `<HStack gap="3" py="3"${p.dividers ? ' borderBottomWidth="1px"' : ""}>${p.showAvatar ? `<Avatar.Root size="sm"><Avatar.Fallback>${r.initials}</Avatar.Fallback></Avatar.Root>` : ""}<Box><Text textStyle="sm" fontWeight="medium">${text(r.item)}</Text>${r.sub ? `<Text textStyle="sm" color="fg.muted">${text(r.sub)}</Text>` : ""}</Box></HStack>`,
      ),
      "</Stack>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Box", "HStack", "Stack", "Text", ...(p.showAvatar ? ["Avatar"] : [])] }],
  }),
};
