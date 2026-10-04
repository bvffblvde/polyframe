import { text } from "../../../exporters/jsx";
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
};
