import { expect, test } from "@playwright/test";

// PROJ-1 Motive-Datenbank — E2E gegen die Akzeptanzkriterien.
// Jeder Test läuft in einem frischen Browser-Context (leeres localStorage).

async function createMotiv(
  page: import("@playwright/test").Page,
  name: string,
  kategorie: "Tier" | "Pflanze" | "Landschaft" = "Tier",
) {
  await page.getByRole("button", { name: "Neues Motiv" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Name *").fill(name);
  // Kategorie ist Pflicht und hat keinen Default → immer aktiv wählen.
  await dialog.getByRole("combobox").click();
  await page.getByRole("option", { name: kategorie }).click();
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog).not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/motive");
});

test("zeigt einen Leerzustand mit Anlegen-Button, wenn keine Motive existieren", async ({
  page,
}) => {
  await expect(page.getByText("Noch keine Motive")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Erstes Motiv anlegen" }),
  ).toBeVisible();
});

test("legt ein Motiv an und zeigt es in der Übersicht", async ({ page }) => {
  await createMotiv(page, "Eisvogel");
  await expect(page.getByRole("heading", { name: "Eisvogel" })).toBeVisible();
});

test("verhindert das Speichern ohne Namen und zeigt eine Validierungsmeldung", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Neues Motiv" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog.getByText("Name ist ein Pflichtfeld.")).toBeVisible();
  await expect(dialog).toBeVisible(); // Dialog bleibt offen
});

test("verlangt eine Kategorie-Auswahl", async ({ page }) => {
  await page.getByRole("button", { name: "Neues Motiv" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name *").fill("Ohne Kategorie");
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog.getByText("Bitte eine Kategorie wählen.")).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("weist eine unsichere Bild-URL ab", async ({ page }) => {
  await page.getByRole("button", { name: "Neues Motiv" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name *").fill("Eisvogel");
  await dialog.getByRole("combobox").click();
  await page.getByRole("option", { name: "Tier" }).click();
  await dialog
    .getByPlaceholder("https://… (optionales Vorschaubild)")
    .fill("javascript:alert(1)");
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(
    dialog.getByText("Bitte eine vollständige http(s)-Adresse angeben."),
  ).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("bearbeitet ein Motiv und zeigt die Änderung", async ({ page }) => {
  await createMotiv(page, "Rotmilan");
  await page.getByRole("link", { name: /Rotmilan/ }).click();
  await page.getByRole("button", { name: "Bearbeiten" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name *").fill("Schwarzmilan");
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(
    page.getByRole("heading", { name: "Schwarzmilan" }),
  ).toBeVisible();
});

test("löscht ein Motiv erst nach Bestätigung", async ({ page }) => {
  await createMotiv(page, "Märzenbecher");
  await page.getByRole("link", { name: /Märzenbecher/ }).click();
  await page.getByRole("button", { name: "Löschen" }).click();

  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toBeVisible();
  await expect(confirm).toContainText("wirklich löschen");
  await confirm.getByRole("button", { name: "Löschen" }).click();

  await expect(page).toHaveURL(/\/motive$/);
  await expect(page.getByText("Noch keine Motive")).toBeVisible();
});

test("filtert die Übersicht per Textsuche", async ({ page }) => {
  await createMotiv(page, "Eisvogel");
  await createMotiv(page, "Feuersalamander");

  await page
    .getByPlaceholder("Suche nach Name, Tag oder Beschreibung…")
    .fill("Eis");

  await expect(page.getByRole("heading", { name: "Eisvogel" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Feuersalamander" }),
  ).toHaveCount(0);
});

test("filtert die Übersicht nach Kategorie", async ({ page }) => {
  await createMotiv(page, "Eisvogel", "Tier");
  await createMotiv(page, "Buschwindröschen", "Pflanze");

  await page.getByRole("tab", { name: "Pflanze" }).click();

  await expect(
    page.getByRole("heading", { name: "Buschwindröschen" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Eisvogel" })).toHaveCount(0);
});

test("zeigt eine Quelle mit Link in der Detailansicht klickbar an", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Neues Motiv" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name *").fill("Eisvogel");
  await dialog.getByRole("button", { name: "Quelle hinzufügen" }).click();
  await dialog.getByPlaceholder("Titel (z. B. NABU-Portal)").fill("NABU");
  await dialog
    .getByPlaceholder("Link (optional)")
    .fill("https://www.nabu.de");
  await dialog.getByRole("button", { name: "Speichern" }).click();

  await page.getByRole("link", { name: /Eisvogel/ }).click();
  const quelle = page.getByRole("link", { name: "NABU" });
  await expect(quelle).toBeVisible();
  await expect(quelle).toHaveAttribute("href", "https://www.nabu.de");
});

test("zeigt 'Keine Treffer' bei erfolgloser Suche", async ({ page }) => {
  await createMotiv(page, "Eisvogel");
  await page
    .getByPlaceholder("Suche nach Name, Tag oder Beschreibung…")
    .fill("xyzqart");
  await expect(page.getByText(/Keine Treffer/)).toBeVisible();
});

test("behält Motive nach einem Reload (localStorage)", async ({ page }) => {
  await createMotiv(page, "Eisvogel");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Eisvogel" })).toBeVisible();
});
