import { expect, test } from "@playwright/test";

// PROJ-8 KI-Motiv-Prompt-Generator & Import — E2E.

function envelope(name: string) {
  return JSON.stringify({
    app: "naturfoto",
    type: "motivpaket",
    version: 1,
    data: {
      motive: [
        {
          name,
          kategorie: "Tier",
          beschreibung: "Ein farbenprächtiger Vogel.",
          tags: ["Vögel"],
          quellen: [{ titel: "NABU", link: "https://www.nabu.de" }],
        },
      ],
      saisonphasen: [{ startKW: 10, endKW: 14, konfidenz: "hoch" }],
    },
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/ki-import");
});

test("erzeugt einen Prompt mit dem Motivnamen", async ({ page }) => {
  await page.getByLabel("Motivname *").fill("Eisvogel");
  await page.getByRole("button", { name: "Prompt erzeugen" }).click();
  const prompt = page.locator("textarea[readonly]");
  await expect(prompt).toHaveValue(/Eisvogel/);
  await expect(prompt).toHaveValue(/motivpaket/);
});

test("verlangt einen Motivnamen", async ({ page }) => {
  await page.getByRole("button", { name: "Prompt erzeugen" }).click();
  await expect(
    page.getByText("Bitte einen Motivnamen eingeben."),
  ).toBeVisible();
});

test("zeigt eine Vorschau und importiert erst nach Bestätigung", async ({
  page,
}) => {
  await page.getByLabel("KI-Antwort").fill(envelope("Rotmilan"));
  await page.getByRole("button", { name: "Vorschau anzeigen" }).click();

  // Vorschau zeigt die erkannten Daten, noch kein Import
  await expect(page.getByText(/Erkannt: „Rotmilan/)).toBeVisible();
  await expect(page.getByText(/KW 10–14/)).toBeVisible();

  await page.getByRole("button", { name: "Importieren" }).click();
  await page.getByRole("link", { name: /Zum importierten Motiv/ }).click();
  await expect(page.getByRole("heading", { name: "Rotmilan" })).toBeVisible();
  await expect(page.getByText("Ein farbenprächtiger Vogel.")).toBeVisible();
});

test("löst JSON aus umgebendem Text (Beifang)", async ({ page }) => {
  const text = `Klar! Hier sind die Daten:\n\n${envelope("Schwarzmilan")}\n\nViel Erfolg!`;
  await page.getByLabel("KI-Antwort").fill(text);
  await page.getByRole("button", { name: "Vorschau anzeigen" }).click();
  await page.getByRole("button", { name: "Importieren" }).click();

  await page.goto("/motive");
  await expect(
    page.getByRole("heading", { name: "Schwarzmilan" }),
  ).toBeVisible();
});

test("zeigt einen Fehler bei ungültiger Antwort", async ({ page }) => {
  await page.getByLabel("KI-Antwort").fill("nur Text, kein JSON");
  await page.getByRole("button", { name: "Vorschau anzeigen" }).click();
  await expect(
    page.getByText("Keine gültigen Motivdaten erkannt."),
  ).toBeVisible();
});
