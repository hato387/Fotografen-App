import { expect, test, type Page } from "@playwright/test";

// PROJ-4 Backup/Import — E2E. Datei-Upload via verstecktem File-Input.

function motivpaket(name: string) {
  return JSON.stringify({
    app: "naturfoto",
    type: "motivpaket",
    version: 1,
    exportedAt: "2026-06-09T00:00:00.000Z",
    data: {
      motive: [
        {
          id: "x1",
          name,
          kategorie: "Tier",
          tags: [],
          quellen: [],
          erstelltAm: "",
          geaendertAm: "",
        },
      ],
      saisonphasen: [],
    },
  });
}

function vollbackup(name: string) {
  return JSON.stringify({
    app: "naturfoto",
    type: "vollbackup",
    version: 1,
    exportedAt: "2026-06-09T00:00:00.000Z",
    data: {
      motive: [
        {
          id: "n1",
          name,
          kategorie: "Pflanze",
          tags: [],
          quellen: [],
          erstelltAm: "",
          geaendertAm: "",
        },
      ],
      saisonphasen: [],
    },
  });
}

// Einmaliges Seeding (kein addInitScript — das würde bei jeder Navigation
// neu schreiben und einen Import wieder überschreiben).
async function seedMotivThenBackup(page: Page, id: string, name: string) {
  await page.goto("/backup");
  await page.evaluate(
    ({ i, n }) => {
      localStorage.setItem(
        "naturfoto:motive",
        JSON.stringify([
          {
            id: i,
            name: n,
            kategorie: "Tier",
            tags: [],
            quellen: [],
            erstelltAm: "",
            geaendertAm: "",
          },
        ]),
      );
    },
    { i: id, n: name },
  );
  await page.reload();
}

async function setFile(page: Page, name: string, content: string) {
  await page.locator('input[type="file"]').setInputFiles({
    name,
    mimeType: "application/json",
    buffer: Buffer.from(content),
  });
}

test("exportiert ein Vollbackup als JSON-Datei", async ({ page }) => {
  await page.goto("/backup");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Vollbackup exportieren" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^naturfoto-backup-.*\.json$/);
});

test("importiert ein Motivpaket und fügt das Motiv hinzu", async ({ page }) => {
  await page.goto("/backup");
  await setFile(page, "paket.json", motivpaket("Importiert"));
  await expect(page.getByText(/Motivpaket: 1 Motive/)).toBeVisible();
  await page.getByRole("button", { name: "Importieren" }).click();

  await page.goto("/motive");
  await expect(page.getByRole("heading", { name: "Importiert" })).toBeVisible();
});

test("lehnt eine ungültige Datei ab, ohne Daten zu ändern", async ({ page }) => {
  await page.goto("/backup");
  await setFile(page, "bad.json", "{kein valides json");
  await expect(page.getByText("Keine gültige JSON-Datei.")).toBeVisible();
});

test("Vollbackup-Import ersetzt alle Daten nach Bestätigung", async ({
  page,
}) => {
  await seedMotivThenBackup(page, "alt1", "Alt");
  await setFile(page, "backup.json", vollbackup("Neu"));
  await expect(page.getByText(/Vollbackup: 1 Motive/)).toBeVisible();

  await page.getByRole("button", { name: "Importieren" }).click();
  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toBeVisible();
  await confirm.getByRole("button", { name: "Ersetzen" }).click();

  await page.goto("/motive");
  await expect(page.getByRole("heading", { name: "Neu" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Alt" })).toHaveCount(0);
});
