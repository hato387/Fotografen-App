import { expect, test, type Page } from "@playwright/test";

// PROJ-2 Saisonphasen — E2E. Phasen werden in der Motiv-Detailansicht gepflegt.

async function createMotivAndOpen(page: Page, name: string) {
  await page.goto("/motive");
  await page.getByRole("button", { name: "Neues Motiv" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name *").fill(name);
  await dialog.getByRole("combobox").click();
  await page.getByRole("option", { name: "Tier" }).click();
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole("link", { name: new RegExp(name) }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

async function pickKw(page: Page, label: RegExp, week: number) {
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: new RegExp(`^KW ${week} `) }).click();
}

async function addPhase(
  page: Page,
  opts: { bezeichnung?: string; startKW: number; endKW: number },
) {
  await page.getByRole("button", { name: "Hinzufügen" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  if (opts.bezeichnung)
    await dialog.getByLabel("Bezeichnung").fill(opts.bezeichnung);
  await pickKw(page, /Start-KW/, opts.startKW);
  await pickKw(page, /End-KW/, opts.endKW);
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog).not.toBeVisible();
}

test("zeigt einen Leerzustand, wenn ein Motiv keine Saisonphasen hat", async ({
  page,
}) => {
  await createMotivAndOpen(page, "Eisvogel");
  await expect(page.getByText("Noch keine Saisonphasen.")).toBeVisible();
});

test("fügt eine Saisonphase hinzu und zeigt Spanne + Konfidenz", async ({
  page,
}) => {
  await createMotivAndOpen(page, "Eisvogel");
  await addPhase(page, { bezeichnung: "Balz", startKW: 10, endKW: 14 });

  await expect(page.getByText("Balz")).toBeVisible();
  await expect(page.getByText("KW 10–14 (Mär–Apr)")).toBeVisible();
  await expect(page.getByText("mittel")).toBeVisible();
});

test("markiert eine Phase als Höhepunkt", async ({ page }) => {
  await createMotivAndOpen(page, "Eisvogel");
  await page.getByRole("button", { name: "Hinzufügen" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Bezeichnung").fill("Brutzeit");
  await pickKw(page, /Start-KW/, 18);
  await pickKw(page, /End-KW/, 26);
  await dialog.getByRole("switch").click();
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog).not.toBeVisible();

  await expect(page.getByText("Brutzeit")).toBeVisible();
  await expect(page.getByTitle("Höhepunkt")).toBeVisible();
});

test("weist auf den Jahresübergang hin (Start > Ende)", async ({ page }) => {
  await createMotivAndOpen(page, "Wintergast");
  await page.getByRole("button", { name: "Hinzufügen" }).click();
  await pickKw(page, /Start-KW/, 48);
  await pickKw(page, /End-KW/, 6);
  await expect(
    page.getByText("Diese Phase läuft über den Jahreswechsel (Dez → Jan)."),
  ).toBeVisible();
});

test("bearbeitet eine Saisonphase", async ({ page }) => {
  await createMotivAndOpen(page, "Eisvogel");
  await addPhase(page, { bezeichnung: "Balz", startKW: 10, endKW: 14 });

  await page
    .locator("section")
    .filter({ hasText: "Saisonphasen" })
    .getByRole("button", { name: "Bearbeiten" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Bezeichnung").fill("Balzzeit");
  await dialog.getByRole("button", { name: "Speichern" }).click();
  await expect(dialog).not.toBeVisible();

  await expect(page.getByText("Balzzeit")).toBeVisible();
});

test("löscht eine Saisonphase nach Bestätigung", async ({ page }) => {
  await createMotivAndOpen(page, "Eisvogel");
  await addPhase(page, { bezeichnung: "Balz", startKW: 10, endKW: 14 });

  // Löschen-Button der Phase (nicht des Motivs)
  await page
    .locator("section")
    .filter({ hasText: "Saisonphasen" })
    .getByRole("button", { name: "Löschen" })
    .click();

  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toBeVisible();
  await confirm.getByRole("button", { name: "Löschen" }).click();

  await expect(page.getByText("Noch keine Saisonphasen.")).toBeVisible();
});

test("warnt beim Motiv-Löschen vor verknüpften Phasen", async ({ page }) => {
  await createMotivAndOpen(page, "Eisvogel");
  await addPhase(page, { bezeichnung: "Balz", startKW: 10, endKW: 14 });

  // Motiv-Löschen-Button (im Kopfbereich)
  await page
    .getByRole("button", { name: "Löschen" })
    .first()
    .click();

  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toContainText("1 Saisonphase");
});
