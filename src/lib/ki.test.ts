import { describe, expect, it } from "vitest";
import { buildPrompt, extractJsonObject, normalizeKiImport } from "@/lib/ki";

describe("buildPrompt", () => {
  it("enthält Name, Hinweise und Format-Vorgabe", () => {
    const p = buildPrompt({ name: "Eisvogel", kategorie: "Tier", region: "Süden" });
    expect(p).toContain("Eisvogel");
    expect(p).toContain("Kategorie: Tier");
    expect(p).toContain("Süden");
    expect(p).toContain("AUSSCHLIESSLICH gültiges JSON");
    expect(p).toContain("motivpaket");
  });
  it("lässt optionale Hinweise weg", () => {
    const p = buildPrompt({ name: "Rotmilan" });
    expect(p).not.toContain("Kategorie:");
    expect(p).not.toContain("Region für");
  });
});

describe("extractJsonObject", () => {
  it("parst reines JSON", () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
  });
  it("löst JSON aus umgebendem Text", () => {
    expect(
      extractJsonObject('Hier ist es:\n{"a":1}\nViel Erfolg!'),
    ).toEqual({ a: 1 });
  });
  it("wirft bei fehlendem JSON", () => {
    expect(() => extractJsonObject("nur Text")).toThrow(
      "Keine gültigen Motivdaten erkannt.",
    );
  });
});

describe("normalizeKiImport", () => {
  const envelope = {
    app: "naturfoto",
    type: "motivpaket",
    version: 1,
    data: {
      motive: [
        {
          name: "Eisvogel",
          kategorie: "Tier",
          tags: ["Vögel"],
          quellen: [{ titel: "NABU", link: "https://nabu.de" }],
        },
      ],
      saisonphasen: [{ startKW: 10, endKW: 14, konfidenz: "hoch" }],
    },
  };

  it("verarbeitet das Envelope-Format und hängt Phasen ans Motiv", () => {
    const d = normalizeKiImport(envelope);
    expect(d.motive).toHaveLength(1);
    expect(d.motive[0].name).toBe("Eisvogel");
    expect(d.motive[0].id).toBeTruthy();
    expect(d.saisonphasen[0].motivId).toBe(d.motive[0].id);
    expect(d.saisonphasen[0].konfidenz).toBe("hoch");
  });

  it("akzeptiert ein einzelnes Motiv-Objekt", () => {
    const d = normalizeKiImport({ name: "Rotmilan", kategorie: "Tier" });
    expect(d.motive[0].name).toBe("Rotmilan");
  });

  it("ersetzt ungültige Kategorie durch 'Tier'", () => {
    const d = normalizeKiImport({ name: "X", kategorie: "Vogel" });
    expect(d.motive[0].kategorie).toBe("Tier");
  });

  it("verwirft Phasen mit ungültiger KW und korrigiert Konfidenz", () => {
    const d = normalizeKiImport({
      name: "X",
      kategorie: "Tier",
      saisonphasen: [
        { startKW: 99, endKW: 4, konfidenz: "hoch" },
        { startKW: 5, endKW: 9, konfidenz: "unbekannt" },
      ],
    });
    expect(d.saisonphasen).toHaveLength(1);
    expect(d.saisonphasen[0].konfidenz).toBe("mittel");
  });

  it("wirft, wenn kein gültiges Motiv enthalten ist", () => {
    expect(() => normalizeKiImport({ foo: "bar" })).toThrow(
      "Keine gültigen Motivdaten erkannt.",
    );
  });
});
