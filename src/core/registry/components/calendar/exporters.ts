import type { ComponentExporters } from "../../../exporters/types";
import { isoDate, monthGrid, monthTitle, weekdayNames } from "../../shared/calendar";
import type { CalendarProps } from "./schema";

const weeks = (p: CalendarProps) => {
  const cells = monthGrid(p.year, p.month, p.weekStart);
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
};
const selectedIso = (p: CalendarProps) => (p.selected ? isoDate(p.year, p.month, p.selected) : "");
const dayjsImport = { from: "dayjs", names: ["default as dayjs"] };

export const calendarExporters: ComponentExporters<CalendarProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<Calendar mode="single" defaultMonth={new Date(${p.year}, ${p.month - 1})}${p.selected ? ` selected={new Date(${p.year}, ${p.month - 1}, ${p.selected})}` : ""} weekStartsOn={${p.weekStart === "monday" ? 1 : 0}} className="rounded-md border" />`,
    imports: [{ from: "@/components/ui/calendar", names: ["Calendar"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: `<LocalizationProvider dateAdapter={AdapterDayjs}><DateCalendar ${selectedIso(p) ? `defaultValue={dayjs("${selectedIso(p)}")}` : `referenceDate={dayjs("${isoDate(p.year, p.month, 1)}")}`} /></LocalizationProvider>`,
    imports: [
      { from: "@mui/x-date-pickers/LocalizationProvider", names: ["LocalizationProvider"] },
      { from: "@mui/x-date-pickers/AdapterDayjs", names: ["AdapterDayjs"] },
      { from: "@mui/x-date-pickers/DateCalendar", names: ["DateCalendar"] },
      dayjsImport,
    ],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<DatePicker defaultDate="${isoDate(p.year, p.month, 1)}"${selectedIso(p) ? ` defaultValue="${selectedIso(p)}"` : ""} firstDayOfWeek={${p.weekStart === "monday" ? 1 : 0}} />`,
    imports: [{ from: "@mantine/dates", names: ["DatePicker"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Calendar fullscreen={false} defaultValue={dayjs("${selectedIso(p) || isoDate(p.year, p.month, 1)}")} />`,
    imports: [{ from: "antd", names: ["Calendar"] }, dayjsImport],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<div className="border rounded-3 p-3">',
      `<div className="d-flex justify-content-between align-items-center mb-2"><Button variant="link" size="sm">‹</Button><strong>${monthTitle(p.locale, p.year, p.month)}</strong><Button variant="link" size="sm">›</Button></div>`,
      '<Table borderless size="sm" className="text-center mb-0">',
      `<thead><tr>${weekdayNames(p.locale, p.weekStart).map((d) => `<th className="text-secondary fw-normal small">${d}</th>`).join("")}</tr></thead>`,
      "<tbody>",
      ...weeks(p).map(
        (w) =>
          `<tr>${w.map((c) => `<td><Button size="sm" variant="${c.inMonth && c.day === p.selected ? "primary" : "light"}"${c.inMonth ? "" : ' className="text-secondary"'}>${c.day}</Button></td>`).join("")}</tr>`,
      ),
      "</tbody>",
      "</Table>",
      "</div>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Button", "Table"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Box borderWidth="1px" rounded="md" p="3">',
      `<HStack justify="space-between" mb="2"><IconButton aria-label="Previous month" size="xs" variant="ghost"><ChevronLeft /></IconButton><Text fontWeight="semibold">${monthTitle(p.locale, p.year, p.month)}</Text><IconButton aria-label="Next month" size="xs" variant="ghost"><ChevronRight /></IconButton></HStack>`,
      '<SimpleGrid columns={7} gap="1" textAlign="center">',
      ...weekdayNames(p.locale, p.weekStart).map((d) => `<Text textStyle="xs" color="fg.muted">${d}</Text>`),
      ...monthGrid(p.year, p.month, p.weekStart).map(
        (c) => `<Button size="xs" variant="${c.inMonth && c.day === p.selected ? "solid" : "ghost"}"${c.inMonth ? "" : ' color="fg.subtle"'}>${c.day}</Button>`,
      ),
      "</SimpleGrid>",
      "</Box>",
    ].join("\n"),
    imports: [
      { from: "@chakra-ui/react", names: ["Box", "Button", "HStack", "IconButton", "SimpleGrid", "Text"] },
      { from: "lucide-react", names: ["ChevronLeft", "ChevronRight"] },
    ],
  }),
};
