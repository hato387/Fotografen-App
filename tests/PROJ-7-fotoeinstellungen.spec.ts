import { expect, test, type Page } from "@playwright/test";

// PROJ-7 Fotoeinstellungen — eigenständige Kamera-Rezepte. E2E.

async function createEinstellung(
  page: Page,
  name: string,
  opts?: { blende?: string; iso?: string },
) {
  await page.getByRole("button", { name: "Neue Fotoeinstellung" }).click();
  const d = page.getByRole("dialog");
  await expect(d).toBeVisible();
  await d.getByLabel("Name *").fill(name);
  if (opts?.blende) await d.getByLabel("Blende").fill(opts.blende);
  if (opts?.iso) await d.getByLabel("ISO").fill(opts.iso);
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(d).not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/fotoeinstellungen");
});

test("zeigt einen Leerzustand mit Anlegen-Button", async ({ page }) => {
  await expect(page.getByText("Noch keine Fotoeinstellungen")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Erste Fotoeinstellung anlegen" }),
  ).toBeVisible();
});

test("legt ein Rezept mit Werten an und zeigt sie", async ({ page }) => {
  await createEinstellung(page, "Vogel im Flug", { blende: "f/5.6", iso: "800" });
  await expect(page.getByRole("heading", { name: "Vogel im Flug" })).toBeVisible();
  await expect(page.getByText("f/5.6")).toBeVisible();
  await expect(page.getByText("800")).toBeVisible();
});

test("kann nur mit Namen speichern", async ({ page }) => {
  await createEinstellung(page, "Nur Name");
  await expect(page.getByRole("heading", { name: "Nur Name" })).toBeVisible();
  await expect(page.getByText("Keine Werte hinterlegt.")).toBeVisible();
});

test("verhindert das Speichern ohne Namen", async ({ page }) => {
  await page.getByRole("button", { name: "Neue Fotoeinstellung" }).click();
  const d = page.getByRole("dialog");
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(d.getByText("Name ist ein Pflichtfeld.")).toBeVisible();
});

test("bearbeitet ein Rezept", async ({ page }) => {
  await createEinstellung(page, "Alt");
  await page.getByRole("button", { name: "Bearbeiten" }).click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Name *").fill("Neu");
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByRole("heading", { name: "Neu" })).toBeVisible();
});

test("löscht ein Rezept nach Bestätigung", async ({ page }) => {
  await createEinstellung(page, "Zum Löschen");
  await page.getByRole("button", { name: "Löschen" }).click();
  const confirm = page.getByRole("alertdialog");
  await confirm.getByRole("button", { name: "Löschen" }).click();
  await expect(page.getByText("Noch keine Fotoeinstellungen")).toBeVisible();
});
