import type { ComponentExporters } from "../../../exporters/types";
import type { IconProps } from "./schema";

const LUCIDE = { star: "Star", heart: "Heart", home: "House", user: "User", settings: "Settings", search: "Search", bell: "Bell", mail: "Mail" } as const;
const MUI = { star: "Star", heart: "Favorite", home: "Home", user: "Person", settings: "Settings", search: "Search", bell: "Notifications", mail: "Mail" } as const;

export const iconExporters: ComponentExporters<IconProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<${LUCIDE[p.glyph]} className="size-full" />`,
    imports: [{ from: "lucide-react", names: [LUCIDE[p.glyph]] }],
  }),
  mui: ({ props: p }) => ({
    jsx: `<${MUI[p.glyph]}Icon sx={{ width: "100%", height: "100%" }} />`,
    imports: [{ from: "@mui/icons-material", names: [`${MUI[p.glyph]} as ${MUI[p.glyph]}Icon`] }],
  }),
  mantine: ({ props: p }) => {
    const name = { star: "Star", heart: "Heart", home: "House", user: "User", settings: "Settings", search: "Search", bell: "Bell", mail: "Mail" }[p.glyph];
    return { jsx: `<${name} size="100%" />`, imports: [{ from: "lucide-react", names: [name] }] };
  },
  antd: ({ props: p }) => {
    const name = { star: "StarOutlined", heart: "HeartOutlined", home: "HomeOutlined", user: "UserOutlined", settings: "SettingOutlined", search: "SearchOutlined", bell: "BellOutlined", mail: "MailOutlined" }[p.glyph];
    return { jsx: `<${name} style={{ fontSize: "100%" }} />`, imports: [{ from: "@ant-design/icons", names: [name] }] };
  },
  bootstrap: ({ props: p }) => {
    const name = { star: "Star", heart: "Heart", home: "House", user: "User", settings: "Settings", search: "Search", bell: "Bell", mail: "Mail" }[p.glyph];
    return { jsx: `<${name} size="100%" />`, imports: [{ from: "lucide-react", names: [name] }] };
  },
  chakra: ({ props: p }) => {
    const name = { star: "Star", heart: "Heart", home: "House", user: "User", settings: "Settings", search: "Search", bell: "Bell", mail: "Mail" }[p.glyph];
    return { jsx: `<${name} size="100%" />`, imports: [{ from: "lucide-react", names: [name] }] };
  },
};
