import { expect, test, type Page } from "@playwright/test";

// PROJ-5 Fotospots (inkl. Beobachtungen & Ideen) — E2E.

async function createSpot(
  page: Page,
  name: string,
  opts?: { lat?: string; lng?: string },
) {
  await page.getByRole("button", { name: "Neuer Fotospot" }).click();
  const d = page.getByRole("dialog");
  await expect(d).toBeVisible();
  await d.getByLabel("Name *").fill(name);
  if (opts?.lat) await d.getByLabel("Breite (lat)").fill(opts.lat);
  if (opts?.lng) await d.getByLabel("Länge (lng)").fill(opts.lng);
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(d).not.toBeVisible();
}

async function seedMotiv(page: Page) {
  await page.goto("/fotospots");
  await page.evaluate(() => {
    localStorage.setItem(
      "naturfoto:motive",
      JSON.stringify([
        {
          id: "m1",
          name: "Eisvogel",
          kategorie: "Tier",
          tags: [],
          quellen: [],
          erstelltAm: "",
          geaendertAm: "",
        },
      ]),
    );
  });
  await page.reload();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/fotospots");
});

test("zeigt einen Leerzustand mit Anlegen-Button", async ({ page }) => {
  await expect(page.getByText("Noch keine Fotospots")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ersten Fotospot anlegen" }),
  ).toBeVisible();
});

test("legt einen Fotospot mit nur einem Namen an", async ({ page }) => {
  await createSpot(page, "Auwald am Flussbogen");
  await expect(
    page.getByRole("heading", { name: "Auwald am Flussbogen" }),
  ).toBeVisible();
});

test("verhindert das Speichern ohne Namen", async ({ page }) => {
  await page.getByRole("button", { name: "Neuer Fotospot" }).click();
  const d = page.getByRole("dialog");
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(d.getByText("Name ist ein Pflichtfeld.")).toBeVisible();
  await expect(d).toBeVisible();
});

test("weist ungültige Koordinaten ab", async ({ page }) => {
  await page.getByRole("button", { name: "Neuer Fotospot" }).click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Name *").fill("Falsche Koordinaten");
  await d.getByLabel("Breite (lat)").fill("999");
  await d.getByLabel("Länge (lng)").fill("11");
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(
    d.getByText("Breitengrad muss zwischen −90 und 90 liegen."),
  ).toBeVisible();
});

test("zeigt 'Auf Karte öffnen' bei vorhandenen Koordinaten", async ({ page }) => {
  await createSpot(page, "Mit GPS", { lat: "48.1371", lng: "11.5754" });
  await page.getByRole("link", { name: /Mit GPS/ }).click();
  await expect(
    page.getByRole("link", { name: /Auf Karte öffnen/ }),
  ).toBeVisible();
});

test("verknüpft ein Motiv und verlinkt zur Motiv-Detailseite", async ({
  page,
}) => {
  await seedMotiv(page);
  await page.getByRole("button", { name: "Neuer Fotospot" }).click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Name *").fill("Flussbogen");
  await d.getByRole("combobox").click();
  await page.getByRole("option", { name: "Eisvogel" }).click();
  await page.keyboard.press("Escape"); // Popover schließen
  await expect(d.getByText("Eisvogel")).toBeVisible(); // Auswahl-Badge
  await d.getByRole("button", { name: "Speichern" }).click();
  await expect(d).not.toBeVisible();

  await page.getByRole("link", { name: /Flussbogen/ }).click();
  await page.getByRole("link", { name: "Eisvogel", exact: true }).click();
  await expect(page).toHaveURL(/\/motive\/m1$/);
});

test("löscht einen Fotospot nach Bestätigung", async ({ page }) => {
  await createSpot(page, "Zum Löschen");
  await page.getByRole("link", { name: /Zum Löschen/ }).click();
  await page.getByRole("button", { name: "Löschen" }).click();
  const confirm = page.getByRole("alertdialog");
  await confirm.getByRole("button", { name: "Löschen" }).click();
  await expect(page).toHaveURL(/\/fotospots$/);
  await expect(page.getByText("Noch keine Fotospots")).toBeVisible();
});
