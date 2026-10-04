import { expect, test, type Page } from "@playwright/test";

async function openEditor(page: Page, locale = "en") {
  await page.context().addInitScript(() => window.localStorage.setItem("polyframe:tour-done", "1"));
  await page.goto(`/${locale}/editor`);
  await expect(page.getByTestId("canvas")).toBeVisible();
  await expect(page.getByTestId("save-status")).toHaveText(locale === "en" ? "Saved" : "Збережено");
}

const nodes = (page: Page, type: string) => page.locator(`[data-export-root] [data-type="${type}"]`);

test("insert, edit, switch skin, reload and export", async ({ page }) => {
  await openEditor(page);
  await page.getByTestId("palette-heading").click();
  await page.getByTestId("palette-input").click();
  await page.getByTestId("palette-button").click();
  await expect(nodes(page, "button")).toHaveCount(1);

  const label = page.getByTestId("prop-label");
  await label.fill("Log in");
  await label.press("Enter");
  await expect(nodes(page, "button")).toHaveText("Log in");

  await page.getByRole("radio", { name: "Styled" }).click();
  await page.getByTestId("skin-select").click();
  await page.getByRole("option", { name: "MUI" }).click();
  const root = page.locator("[data-export-root]").first();
  await expect(root).toHaveAttribute("data-mode", "styled");
  await expect(root).toHaveAttribute("data-skin", "mui");

  for (const skin of ["Mantine", "Ant Design", "Bootstrap", "shadcn/ui"]) {
    await page.getByTestId("skin-select").click();
    await page.getByRole("option", { name: skin }).click();
  }
  await expect(root).toHaveAttribute("data-skin", "shadcn");

  await expect(page.getByTestId("save-status")).toHaveText("Saved");
  await page.reload();
  await expect(nodes(page, "button")).toHaveText("Log in");
  await expect(nodes(page, "heading")).toHaveCount(1);
  await expect(page.locator("[data-export-root]").first()).toHaveAttribute("data-skin", "shadcn");

  await page.getByRole("button", { name: "Export" }).click();
  await page.getByRole("menuitem", { name: "PNG..." }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
});

test("drag from palette, move on canvas, undo and redo", async ({ page }) => {
  await openEditor(page);
  const canvas = page.getByTestId("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("no canvas");
  const item = await page.getByTestId("palette-card").boundingBox();
  if (!item) throw new Error("no palette item");
  await page.mouse.move(item.x + 20, item.y + 20);
  await page.mouse.down();
  await page.mouse.move(item.x + 40, item.y + 30, { steps: 4 });
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();
  const card = nodes(page, "card");
  await expect(card).toHaveCount(1);

  const before = await card.boundingBox();
  if (!before) throw new Error("no card");
  await page.mouse.move(before.x + 20, before.y + 20);
  await page.mouse.down();
  await page.mouse.move(before.x + 80, before.y + 60, { steps: 5 });
  await page.mouse.up();
  const after = await card.boundingBox();
  expect(after && after.x).toBeGreaterThan(before.x + 20);

  await page.keyboard.press("ControlOrMeta+z");
  await expect.poll(async () => (await card.boundingBox())?.x).toBeCloseTo(before.x, 0);
  await page.keyboard.press("ControlOrMeta+z");
  await expect(card).toHaveCount(0);
  await page.keyboard.press("ControlOrMeta+Shift+z");
  await expect(card).toHaveCount(1);
  await card.click();
  await page.keyboard.press("ControlOrMeta+d");
  await expect(card).toHaveCount(2);
  await page.keyboard.press("Delete");
  await expect(card).toHaveCount(1);
});

test("rejects an invalid JSON import", async ({ page }) => {
  await openEditor(page);
  await page.getByTestId("import-input").setInputFiles({
    name: "broken.polyframe.json",
    mimeType: "application/json",
    buffer: Buffer.from("{not json"),
  });
  await expect(page.getByText("The file is not valid JSON.")).toBeVisible();
  await page.getByTestId("import-input").setInputFiles({
    name: "wrong.polyframe.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ schemaVersion: 1, id: "x" })),
  });
  await expect(page.getByText(/not a valid Polyframe project/)).toBeVisible();
});

test("switches locale", async ({ page }) => {
  await openEditor(page);
  await page.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "Українська" }).click();
  await expect(page).toHaveURL(/\/uk\/editor/);
  await expect(page.getByRole("tab", { name: "Компоненти" })).toBeVisible();
  await page.getByTestId("palette-button").click();
  await expect(nodes(page, "button")).toHaveText("Кнопка");
});

test("groups and ungroups nodes, aligns a selection", async ({ page }) => {
  await openEditor(page);
  await page.getByTestId("palette-button").click();
  await page.getByTestId("palette-badge").click();
  await page.getByTestId("canvas").focus();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("ControlOrMeta+g");
  await page.keyboard.press("Escape");
  await nodes(page, "badge").click();
  await expect(page.getByText("2 layers selected")).toBeVisible();
  await page.getByRole("button", { name: "Align left" }).click();
  const [a, b] = await Promise.all([nodes(page, "badge").boundingBox(), nodes(page, "button").boundingBox()]);
  expect(Math.round(a?.x ?? 0)).toBe(Math.round(b?.x ?? 1));
  await page.keyboard.press("ControlOrMeta+Shift+g");
  await page.keyboard.press("Escape");
  await nodes(page, "badge").click();
  await expect(page.getByText("2 layers selected")).toHaveCount(0);
});

test("shares a project through a link", async ({ page, context }) => {
  await openEditor(page);
  await page.getByTestId("palette-button").click();
  const label = page.getByTestId("prop-label");
  await label.fill("Shared!");
  await label.press("Enter");
  await page.getByRole("button", { name: "Share" }).click();
  const url = await page.getByTestId("share-url").inputValue();
  expect(url).toContain("/en/view#/share/");

  const viewer = await context.newPage();
  await viewer.goto(url);
  await expect(viewer.getByText("Shared project")).toBeVisible();
  await expect(nodes(viewer, "button")).toHaveText("Shared!");
  await viewer.getByRole("button", { name: "Duplicate to my projects" }).click();
  await expect(viewer).toHaveURL(/\/en\/editor$/);
  await expect(nodes(viewer, "button")).toHaveText("Shared!");

  await viewer.goto("/en/view#/share/broken");
  await expect(viewer.getByRole("alert").filter({ hasText: "share link is broken" })).toBeVisible();
});

test("runs commands from the command palette", async ({ page }) => {
  await openEditor(page);
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByPlaceholder("Type a command or search...").fill("skin: mui");
  await page.keyboard.press("Enter");
  const root = page.locator("[data-export-root]").first();
  await expect(root).toHaveAttribute("data-skin", "mui");
  await expect(root).toHaveAttribute("data-mode", "styled");
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByPlaceholder("Type a command or search...").fill("кнопка");
  await page.keyboard.press("Enter");
  await expect(nodes(page, "button")).toHaveCount(1);
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByPlaceholder("Type a command or search...").fill("template: login");
  await page.keyboard.press("Enter");
  await expect(nodes(page, "checkbox")).toHaveCount(1);
});

test("exports code for shadcn and MUI", async ({ page }) => {
  await openEditor(page);
  await page.getByTestId("palette-button").click();
  await page.getByRole("button", { name: "Export" }).click();
  await page.getByRole("menuitem", { name: "Code..." }).click();
  const preview = page.getByTestId("code-preview");
  await expect(preview).toContainText('from "@/components/ui/button"');
  await expect(preview).toContainText("export default function Desktop1()");
  await page.getByRole("combobox", { name: "Target" }).click();
  await page.getByRole("option", { name: "MUI" }).click();
  await expect(preview).toContainText('from "@mui/material"');
  await page.getByRole("combobox", { name: "Layout" }).click();
  await page.getByRole("option", { name: "Stacked" }).click();
  await expect(preview).toContainText('flexDirection: "column"');
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .tsx" }).click();
  expect((await download).suggestedFilename()).toBe("Desktop1.tsx");
});

test("shows the product tour on the first visit only", async ({ page }) => {
  await page.goto("/en/editor");
  const tour = page.getByTestId("tour");
  await expect(tour).toContainText("Welcome to Polyframe");
  for (const title of ["Add components", "Arrange on the canvas", "Edit in the Inspector", "Organize layers", "Switch the look", "Export your work", "Share a link", "Work faster"]) {
    await page.getByRole("button", { name: "Next" }).click();
    await expect(tour).toContainText(title);
  }
  await expect(tour.getByRole("link", { name: "Read the full guide" })).toHaveAttribute("href", "/en/guide");
  await page.getByRole("button", { name: "Start building" }).click();
  await expect(tour).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("save-status")).toHaveText("Saved");
  await expect(tour).toHaveCount(0);
  await page.getByRole("button", { name: "Help" }).click();
  await page.getByRole("menuitem", { name: "Take the tour" }).click();
  await expect(tour).toContainText("Welcome to Polyframe");
  await page.keyboard.press("Escape");
  await expect(tour).toHaveCount(0);
});
