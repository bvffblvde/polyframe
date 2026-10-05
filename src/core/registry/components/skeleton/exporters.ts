import type { ComponentExporters } from "../../../exporters/types";
import type { SkeletonProps } from "./schema";

const range = (p: SkeletonProps) => Array.from({ length: p.lines }, (_, i) => i === p.lines - 1 && p.lines > 1);

export const skeletonExporters: ComponentExporters<SkeletonProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<div className="flex items-center gap-4">${p.showAvatar ? '<Skeleton className="size-12 rounded-full" />' : ""}<div className="flex-1 space-y-2">${range(p).map((last) => `<Skeleton className="h-4 ${last ? "w-3/4" : "w-full"}" />`).join("")}</div></div>`,
    imports: [{ from: "@/components/ui/skeleton", names: ["Skeleton"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Stack direction="row" spacing={2} alignItems="center">${p.showAvatar ? '<Skeleton variant="circular" width={48} height={48} />' : ""}<Box sx={{ flex: 1 }}>${range(p).map((last) => `<Skeleton variant="text"${last ? ' width="75%"' : ""} />`).join("")}</Box></Stack>`,
    imports: [{ from: "@mui/material", names: ["Box", "Skeleton", "Stack"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Group wrap="nowrap">${p.showAvatar ? "<Skeleton height={48} circle />" : ""}<Stack gap={8} style={{ flex: 1 }}>${range(p).map((last) => `<Skeleton height={12}${last ? ' width="75%"' : ""} radius="xl" />`).join("")}</Stack></Group>`,
    imports: [{ from: "@mantine/core", names: ["Group", "Skeleton", "Stack"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Skeleton active${p.showAvatar ? " avatar" : ""} title={false} paragraph={{ rows: ${p.lines} }} />`,
    imports: [{ from: "antd", names: ["Skeleton"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<div className="d-flex align-items-center gap-3">${p.showAvatar ? '<Placeholder as="span" animation="glow"><Placeholder className="rounded-circle" style={{ width: 48, height: 48 }} /></Placeholder>' : ""}<Placeholder as="div" animation="glow" className="flex-grow-1">${range(p).map((last) => `<Placeholder xs={${last ? 8 : 12}} />`).join(" ")}</Placeholder></div>`,
    imports: [{ from: "react-bootstrap", names: ["Placeholder"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<HStack gap="4">${p.showAvatar ? '<SkeletonCircle size="12" />' : ""}<SkeletonText noOfLines={${p.lines}} flex="1" /></HStack>`,
    imports: [{ from: "@chakra-ui/react", names: ["HStack", "SkeletonText", ...(p.showAvatar ? ["SkeletonCircle"] : [])] }],
  }),
};
