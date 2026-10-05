import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import { formatDate } from "../../shared/calendar";
import type { DatepickerProps } from "./schema";

const dayjsImport = { from: "dayjs", names: ["default as dayjs"] };

export const datepickerExporters: ComponentExporters<DatepickerProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: [
      '<div className="grid w-full gap-2">',
      p.label ? `<Label htmlFor="${ctx.uid}">${text(p.label)}</Label>` : "",
      `<Button id="${ctx.uid}" variant="outline" className="justify-start font-normal${p.value ? "" : " text-muted-foreground"}"${bool("disabled", p.disabled)}><CalendarIcon />${text(p.value ? formatDate(p.locale, p.value) : p.placeholder)}</Button>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/button", names: ["Button"] },
      { from: "lucide-react", names: ["Calendar as CalendarIcon"] },
      ...(p.label ? [{ from: "@/components/ui/label", names: ["Label"] }] : []),
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker${p.label ? ` label=${str(p.label)}` : ""}${p.value ? ` defaultValue={dayjs("${p.value}")}` : ""}${bool("disabled", p.disabled)} slotProps={{ textField: { fullWidth: true } }} /></LocalizationProvider>`,
    imports: [
      { from: "@mui/x-date-pickers/LocalizationProvider", names: ["LocalizationProvider"] },
      { from: "@mui/x-date-pickers/AdapterDayjs", names: ["AdapterDayjs"] },
      { from: "@mui/x-date-pickers/DatePicker", names: ["DatePicker"] },
      ...(p.value ? [dayjsImport] : []),
    ],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<DatePickerInput${p.label ? ` label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue="${p.value}"` : ""}${bool("disabled", p.disabled)} />`,
    imports: [{ from: "@mantine/dates", names: ["DatePickerInput"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      "<Flex vertical gap={8}>",
      p.label ? `<Typography.Text>${text(p.label)}</Typography.Text>` : "",
      `<DatePicker style={{ width: "100%" }}${p.value ? ` defaultValue={dayjs("${p.value}")}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${bool("disabled", p.disabled)} />`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["DatePicker", "Flex", ...(p.label ? ["Typography"] : [])] }, ...(p.value ? [dayjsImport] : [])],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: `<Form.Group controlId="${ctx.uid}">${p.label ? `<Form.Label>${text(p.label)}</Form.Label>` : ""}<Form.Control type="date"${p.value ? ` defaultValue="${p.value}"` : ""}${bool("disabled", p.disabled)} /></Form.Group>`,
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Field.Root${bool("disabled", p.disabled)}>${p.label ? `<Field.Label>${text(p.label)}</Field.Label>` : ""}<Input type="date"${p.value ? ` defaultValue="${p.value}"` : ""} /></Field.Root>`,
    imports: [{ from: "@chakra-ui/react", names: ["Field", "Input"] }],
  }),
};
