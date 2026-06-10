import { expect, test, type Page } from "@playwright/test";

// PROJ-3 Kalender — E2E. localStorage wird direkt geseedet (deterministische Daten).

const NOW = "2026-06-09T00:00:00.000Z";

const SEED = {
  motive: [
    {
      id: "m1",
      name: "Eisvogel",
      kategorie: "Tier",
      tags: ["Vögel"],
      quellen: [],
      erstelltAm: NOW,
      geaendertAm: NOW,
    },
    {
      id: "m2",
      name: "Buschwindröschen",
      kategorie: "Pflanze",
      tags: [],
      quellen: [],
      erstelltAm: NOW,
      geaendertAm: NOW,
    },
  ],
  phasen: [
    {
      id: "p1",
      motivId: "m1",
      startKW: 1,
      endKW: 53, // ganzjährig → immer aktiv
      konfidenz: "hoch",
      hoehepunkt: true,
      erstelltAm: NOW,
      geaendertAm: NOW,
    },
    {
      id: "p2",
      motivId: "m2",
      startKW: 10,
      endKW: 14,
      konfidenz: "mittel",
      hoehepunkt: false,
      erstelltAm: NOW,
      geaendertAm: NOW,
    },
  ],
};

async function seed(page: Page) {
  await page.addInitScript((data) => {
    localStorage.setItem("naturfoto:motive", JSON.stringify(data.motive));
    localStorage.setItem("naturfoto:saisonphasen", JSON.stringify(data.phasen));
  }, SEED);
}

test("zeigt einen Hinweis, wenn keine Motive existieren", async ({ page }) => {
  await page.goto("/kalender");
  await expect(page.getByText(/Noch keine Motive/)).toBeVisible();
});

test("Wochenansicht zeigt ein ganzjährig aktives Motiv", async ({ page }) => {
  await seed(page);
  await page.goto("/kalender");
  await expect(page.getByRole("heading", { name: "Kalender" })).toBeVisible();
  // Eisvogel ist ganzjährig aktiv → erscheint im Aktiv-Block
  await expect(page.getByText("Eisvogel")).toBeVisible();
});

test("Umschalten auf Jahres-Timeline zeigt Balken", async ({ page }) => {
  await seed(page);
  await page.goto("/kalender");
  await page.getByRole("tab", { name: "Jahres-Timeline" }).click();
  await expect(
    page.getByRole("link", { name: "Eisvogel" }).first(),
  ).toBeVisible();
  // Balken trägt einen Tooltip-Titel mit der KW-Spanne
  await expect(page.locator('[title*="KW 1–53"]').first()).toBeVisible();
});

test("Kategoriefilter blendet andere Kategorien aus", async ({ page }) => {
  await seed(page);
  await page.goto("/kalender");
  await page.getByRole("tab", { name: "Jahres-Timeline" }).click();

  await page.getByLabel("Kategorie").click();
  await page.getByRole("option", { name: "Pflanze" }).click();

  await expect(page.getByText("Buschwindröschen")).toBeVisible();
  await expect(page.getByRole("link", { name: "Eisvogel" })).toHaveCount(0);
});

test("Klick auf ein Motiv führt zur Detailseite", async ({ page }) => {
  await seed(page);
  await page.goto("/kalender");
  await page.getByRole("tab", { name: "Jahres-Timeline" }).click();
  await page.getByRole("link", { name: "Eisvogel" }).first().click();
  await expect(page).toHaveURL(/\/motive\/m1$/);
  await expect(page.getByRole("heading", { name: "Eisvogel" })).toBeVisible();
});

test("Nur-Höhepunkte-Filter behält die Höhepunkt-Phase", async ({ page }) => {
  await seed(page);
  await page.goto("/kalender");
  await page.getByRole("tab", { name: "Jahres-Timeline" }).click();

  await page.getByLabel("Nur Höhepunkte").click();
  // Eisvogel (Höhepunkt) bleibt, Buschwindröschen (kein Höhepunkt) verschwindet
  await expect(
    page.getByRole("link", { name: "Eisvogel" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Buschwindröschen")).toHaveCount(0);
});
