import type { TemplateDefinition } from "./types";

const split = (s: string) => s.split("|").map((x) => x.trim());

export const login: TemplateDefinition = {
  id: "login",
  preset: "laptop",
  build: (t) => [
    { type: "card", x: 440, y: 160, w: 400, h: 460, props: { title: "", body: "", showFooter: false, actionLabel: "" } },
    { type: "heading", x: 480, y: 200, w: 320, h: 40, props: { text: t("login.title"), level: "3", align: "center" } },
    { type: "text", x: 480, y: 244, w: 320, h: 24, props: { text: t("login.subtitle"), size: "sm", align: "center", muted: true } },
    { type: "input", x: 480, y: 292, w: 320, h: 64 },
    { type: "input", x: 480, y: 372, w: 320, h: 64, props: { label: t("login.password"), placeholder: "••••••••", value: "", helperText: "", size: "md", invalid: false, disabled: false } },
    { type: "checkbox", x: 480, y: 452, w: 160, h: 24 },
    { type: "link", x: 664, y: 452, w: 136, h: 24, props: { text: t("login.forgot"), underline: false } },
    { type: "button", x: 480, y: 500, w: 320, h: 40, props: { label: t("login.submit"), variant: "solid", size: "md", disabled: false } },
    { type: "text", x: 480, y: 564, w: 320, h: 24, props: { text: t("login.signup"), size: "sm", align: "center", muted: true } },
  ],
};

export const dashboard: TemplateDefinition = {
  id: "dashboard",
  preset: "desktop",
  build: (t) => {
    const stats = split(t("dashboard.stats"));
    const values = ["$12,400", "1,240", "312"];
    return [
      { type: "navbar", x: 0, y: 0, w: 1440, h: 64, props: { brand: "Acme", links: [], actionLabel: "", showAvatar: true } },
      { type: "sidebar", x: 0, y: 64, w: 240, h: 960 },
      { type: "heading", x: 280, y: 104, w: 600, h: 40, props: { text: t("dashboard.title"), level: "2", align: "left" } },
      { type: "button", x: 1240, y: 104, w: 160, h: 40, props: { label: t("dashboard.action"), variant: "solid", size: "md", disabled: false } },
      ...stats.map((label, i) => ({
        type: "card" as const,
        x: 280 + i * 384,
        y: 176,
        w: 352,
        h: 136,
        props: { title: values[i] ?? "", body: label, showFooter: false, actionLabel: "" },
      })),
      { type: "progress", x: 280, y: 344, w: 1120, h: 40, props: { label: t("dashboard.goal"), value: 72, showValue: true } },
      { type: "table", x: 280, y: 416, w: 1120, h: 200 },
    ];
  },
};

export const landing: TemplateDefinition = {
  id: "landing",
  preset: "desktop",
  build: (t) => [
    { type: "navbar", x: 0, y: 0, w: 1440, h: 72 },
    { type: "badge", x: 120, y: 216, w: 120, h: 28, props: { text: t("landing.badge"), variant: "soft" } },
    { type: "heading", x: 120, y: 264, w: 560, h: 132, props: { text: t("landing.title"), level: "1", align: "left" } },
    { type: "text", x: 120, y: 416, w: 520, h: 72, props: { text: t("landing.subtitle"), size: "lg", align: "left", muted: true } },
    { type: "button", x: 120, y: 520, w: 168, h: 48, props: { label: t("landing.primary"), variant: "solid", size: "lg", disabled: false } },
    { type: "button", x: 304, y: 520, w: 168, h: 48, props: { label: t("landing.secondary"), variant: "outline", size: "lg", disabled: false } },
    { type: "image", x: 760, y: 168, w: 560, h: 440, props: { caption: "", rounded: true } },
  ],
};

export const settings: TemplateDefinition = {
  id: "settings",
  preset: "laptop",
  build: (t) => [
    { type: "sidebar", x: 0, y: 0, w: 240, h: 800, props: { title: t("settings.menu"), items: split(t("settings.items")), activeIndex: 2 } },
    { type: "heading", x: 288, y: 40, w: 600, h: 40, props: { text: t("settings.title"), level: "2", align: "left" } },
    { type: "tabs", x: 288, y: 104, w: 640, h: 48, props: { tabs: split(t("settings.tabs")), activeIndex: 0, content: "" } },
    { type: "input", x: 288, y: 184, w: 304, h: 64, props: { label: t("settings.name"), placeholder: "", value: t("settings.nameValue"), helperText: "", size: "md", invalid: false, disabled: false } },
    { type: "input", x: 624, y: 184, w: 304, h: 64, props: { label: t("settings.email"), placeholder: "", value: "olena@example.com", helperText: "", size: "md", invalid: false, disabled: false } },
    { type: "select", x: 288, y: 272, w: 304, h: 64 },
    { type: "textarea", x: 288, y: 360, w: 640, h: 120, props: { label: t("settings.bio"), placeholder: "", value: "", disabled: false } },
    { type: "divider", x: 288, y: 504, w: 640, h: 16 },
    { type: "switch", x: 288, y: 536, w: 320, h: 28, props: { label: t("settings.notify"), checked: true, disabled: false } },
    { type: "switch", x: 288, y: 576, w: 320, h: 28, props: { label: t("settings.newsletter"), checked: false, disabled: false } },
    { type: "button", x: 800, y: 640, w: 128, h: 40, props: { label: t("settings.save"), variant: "solid", size: "md", disabled: false } },
    { type: "button", x: 656, y: 640, w: 128, h: 40, props: { label: t("settings.cancel"), variant: "ghost", size: "md", disabled: false } },
  ],
};

export const pricing: TemplateDefinition = {
  id: "pricing",
  preset: "desktop",
  build: (t) => {
    const plans = split(t("pricing.plans"));
    const prices = ["$0", "$19", "$49"];
    return [
      { type: "heading", x: 320, y: 120, w: 800, h: 48, props: { text: t("pricing.title"), level: "1", align: "center" } },
      { type: "text", x: 420, y: 184, w: 600, h: 48, props: { text: t("pricing.subtitle"), size: "lg", align: "center", muted: true } },
      ...plans.flatMap((plan, i) => {
        const x = 168 + i * 384;
        return [
          { type: "card" as const, x, y: 288, w: 352, h: 420, props: { title: plan, body: "", showFooter: false, actionLabel: "" }, style: i === 1 ? { shadow: 3 as const } : undefined },
          { type: "heading" as const, x: x + 20, y: 344, w: 312, h: 48, props: { text: prices[i] ?? "", level: "1", align: "left" } },
          { type: "text" as const, x: x + 20, y: 408, w: 312, h: 160, props: { text: t(`pricing.features${i + 1}`), size: "md", align: "left", muted: false } },
          { type: "button" as const, x: x + 20, y: 636, w: 312, h: 44, props: { label: t("pricing.cta"), variant: i === 1 ? "solid" : "outline", size: "md", disabled: false } },
        ];
      }),
      { type: "badge", x: 640, y: 300, w: 104, h: 24, props: { text: t("pricing.popular"), variant: "solid" } },
    ];
  },
};

export const mobileProfile: TemplateDefinition = {
  id: "mobileProfile",
  preset: "mobile",
  build: (t) => [
    { type: "navbar", x: 0, y: 0, w: 390, h: 56, props: { brand: t("mobile.title"), links: [], actionLabel: "", showAvatar: false } },
    { type: "avatar", x: 147, y: 88, w: 96, h: 96, props: { initials: t("mobile.initials"), shape: "circle" } },
    { type: "heading", x: 24, y: 200, w: 342, h: 36, props: { text: t("mobile.name"), level: "3", align: "center" } },
    { type: "text", x: 24, y: 240, w: 342, h: 24, props: { text: t("mobile.role"), size: "sm", align: "center", muted: true } },
    { type: "button", x: 24, y: 288, w: 164, h: 40, props: { label: t("mobile.follow"), variant: "solid", size: "md", disabled: false } },
    { type: "button", x: 202, y: 288, w: 164, h: 40, props: { label: t("mobile.message"), variant: "outline", size: "md", disabled: false } },
    { type: "tabs", x: 24, y: 352, w: 342, h: 120, props: { tabs: split(t("mobile.tabs")), activeIndex: 0, content: t("mobile.about") } },
    { type: "divider", x: 24, y: 488, w: 342, h: 16 },
    { type: "switch", x: 24, y: 520, w: 342, h: 28, props: { label: t("mobile.private"), checked: false, disabled: false } },
    { type: "switch", x: 24, y: 564, w: 342, h: 28, props: { label: t("mobile.notify"), checked: true, disabled: false } },
    { type: "progress", x: 24, y: 616, w: 342, h: 40, props: { label: t("mobile.complete"), value: 80, showValue: true } },
  ],
};

export const TEMPLATES: TemplateDefinition[] = [login, dashboard, landing, settings, pricing, mobileProfile];
