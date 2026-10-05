import type { ComponentExporters } from "../../../exporters/types";
import { pageList } from "../../shared/pages";
import type { PaginationProps } from "./schema";

export const paginationExporters: ComponentExporters<PaginationProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      "<Pagination>",
      "<PaginationContent>",
      '<PaginationItem><PaginationPrevious href="#" /></PaginationItem>',
      ...pageList(p.pages, p.current).map((page) =>
        page === "ellipsis"
          ? "<PaginationItem><PaginationEllipsis /></PaginationItem>"
          : `<PaginationItem><PaginationLink href="#"${page === p.current ? " isActive" : ""}>${page}</PaginationLink></PaginationItem>`,
      ),
      '<PaginationItem><PaginationNext href="#" /></PaginationItem>',
      "</PaginationContent>",
      "</Pagination>",
    ].join("\n"),
    imports: [
      {
        from: "@/components/ui/pagination",
        names: ["Pagination", "PaginationContent", "PaginationEllipsis", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious"],
      },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Pagination count={${p.pages}} defaultPage={${Math.min(p.current, p.pages)}} color="primary" />`,
    imports: [{ from: "@mui/material", names: ["Pagination"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Pagination total={${p.pages}} defaultValue={${Math.min(p.current, p.pages)}} />`,
    imports: [{ from: "@mantine/core", names: ["Pagination"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Pagination defaultCurrent={${Math.min(p.current, p.pages)}} total={${p.pages * 10}} showSizeChanger={false} />`,
    imports: [{ from: "antd", names: ["Pagination"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<Pagination className="mb-0">',
      "<Pagination.Prev />",
      ...pageList(p.pages, p.current).map((page) =>
        page === "ellipsis" ? "<Pagination.Ellipsis />" : `<Pagination.Item${page === p.current ? " active" : ""}>{${page}}</Pagination.Item>`,
      ),
      "<Pagination.Next />",
      "</Pagination>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Pagination"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Pagination.Root count={${p.pages * 10}} pageSize={10} defaultPage={${Math.min(p.current, p.pages)}}>`,
      '<ButtonGroup variant="ghost" size="sm">',
      "<Pagination.PrevTrigger asChild><IconButton aria-label=\"Previous page\"><ChevronLeft /></IconButton></Pagination.PrevTrigger>",
      '<Pagination.Items render={(page) => <IconButton variant={{ base: "ghost", _selected: "outline" }}>{page.value}</IconButton>} />',
      "<Pagination.NextTrigger asChild><IconButton aria-label=\"Next page\"><ChevronRight /></IconButton></Pagination.NextTrigger>",
      "</ButtonGroup>",
      "</Pagination.Root>",
    ].join("\n"),
    imports: [
      { from: "@chakra-ui/react", names: ["ButtonGroup", "IconButton", "Pagination"] },
      { from: "lucide-react", names: ["ChevronLeft", "ChevronRight"] },
    ],
  }),
};
