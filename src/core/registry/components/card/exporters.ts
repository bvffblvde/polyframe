import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { CardProps } from "./schema";

const ui = (name: string, names: string[]) => ({ from: `@/components/ui/${name}`, names });

export const cardExporters: ComponentExporters<CardProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<Card className="h-full w-full">',
      p.title && `<CardHeader><CardTitle>${text(p.title)}</CardTitle></CardHeader>`,
      p.body && `<CardContent><p className="whitespace-pre-line text-sm text-muted-foreground">${text(p.body)}</p></CardContent>`,
      p.showFooter && `<CardFooter className="justify-end"><Button size="sm">${text(p.actionLabel)}</Button></CardFooter>`,
      "</Card>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      ui("card", [
        "Card",
        ...(p.title ? ["CardHeader", "CardTitle"] : []),
        ...(p.body ? ["CardContent"] : []),
        ...(p.showFooter ? ["CardFooter"] : []),
      ]),
      ...(p.showFooter ? [ui("button", ["Button"])] : []),
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Card sx={{ height: "100%" }}>',
      "<CardContent>",
      p.title && `<Typography variant="h6" component="div" gutterBottom>${text(p.title)}</Typography>`,
      p.body && `<Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>${text(p.body)}</Typography>`,
      "</CardContent>",
      p.showFooter && `<CardActions sx={{ justifyContent: "flex-end" }}><Button size="small" variant="contained">${text(p.actionLabel)}</Button></CardActions>`,
      "</Card>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Card", "CardContent", "Typography", ...(p.showFooter ? ["CardActions", "Button"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Card withBorder shadow="sm" padding="lg" radius="md" h="100%">',
      p.title && `<Text fw={600} size="lg">${text(p.title)}</Text>`,
      p.body && `<Text size="sm" c="dimmed" mt="xs" style={{ whiteSpace: "pre-line" }}>${text(p.body)}</Text>`,
      p.showFooter && `<Group justify="flex-end" mt="auto"><Button size="xs">${text(p.actionLabel)}</Button></Group>`,
      "</Card>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mantine/core", names: ["Card", "Text", ...(p.showFooter ? ["Group", "Button"] : [])] }],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      `<Card${p.title ? ` title=${str(p.title)}` : ""} style={{ height: "100%" }}${p.showFooter ? ` actions={[<Button key="action" type="primary" size="small">${text(p.actionLabel)}</Button>]}` : ""}>`,
      p.body ? `<Typography.Paragraph type="secondary" style={{ whiteSpace: "pre-line", margin: 0 }}>${text(p.body)}</Typography.Paragraph>` : "",
      "</Card>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["Card", ...(p.body ? ["Typography"] : []), ...(p.showFooter ? ["Button"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<Card className="h-100">',
      "<Card.Body>",
      p.title && `<Card.Title>${text(p.title)}</Card.Title>`,
      p.body && `<Card.Text className="text-secondary" style={{ whiteSpace: "pre-line" }}>${text(p.body)}</Card.Text>`,
      "</Card.Body>",
      p.showFooter && `<Card.Footer className="text-end bg-transparent border-0"><Button size="sm">${text(p.actionLabel)}</Button></Card.Footer>`,
      "</Card>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Card", ...(p.showFooter ? ["Button"] : [])] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Card.Root h="full">',
      '<Card.Body gap="2">',
      p.title && `<Card.Title>${text(p.title)}</Card.Title>`,
      p.body && `<Card.Description whiteSpace="pre-line">${text(p.body)}</Card.Description>`,
      "</Card.Body>",
      p.showFooter && `<Card.Footer justifyContent="flex-end"><Button size="sm">${text(p.actionLabel)}</Button></Card.Footer>`,
      "</Card.Root>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Card", ...(p.showFooter ? ["Button"] : [])] }],
  }),
};
