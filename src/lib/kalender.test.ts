import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTER,
  motivPasses,
  phasePassesQuality,
} from "@/lib/kalender";
import { Motiv, Saisonphase } from "@/lib/types";

function motiv(over: Partial<Motiv> = {}): Motiv {
  return {
    id: "m",
    name: "Eisvogel",
    kategorie: "Tier",
    tags: ["Vögel"],
    quellen: [],
    erstelltAm: "",
    geaendertAm: "",
    ...over,
  };
}

function phase(over: Partial<Saisonphase> = {}): Saisonphase {
  return {
    id: "p",
    motivId: "m",
    startKW: 10,
    endKW: 14,
    konfidenz: "mittel",
    hoehepunkt: false,
    erstelltAm: "",
    geaendertAm: "",
    ...over,
  };
}

describe("motivPasses", () => {
  it("Standardfilter lässt alles durch", () => {
    expect(motivPasses(motiv(), DEFAULT_FILTER)).toBe(true);
  });
  it("Kategoriefilter", () => {
    expect(motivPasses(motiv(), { ...DEFAULT_FILTER, kategorie: "Pflanze" })).toBe(
      false,
    );
  });
  it("Textsuche über Name und Tags", () => {
    expect(motivPasses(motiv(), { ...DEFAULT_FILTER, query: "eis" })).toBe(true);
    expect(motivPasses(motiv(), { ...DEFAULT_FILTER, query: "vögel" })).toBe(true);
    expect(motivPasses(motiv(), { ...DEFAULT_FILTER, query: "xyz" })).toBe(false);
  });
  it("Tag-Filter verlangt alle gewählten Tags", () => {
    expect(motivPasses(motiv(), { ...DEFAULT_FILTER, tags: ["Vögel"] })).toBe(true);
    expect(motivPasses(motiv(), { ...DEFAULT_FILTER, tags: ["Makro"] })).toBe(false);
  });
});

describe("phasePassesQuality", () => {
  it("Konfidenz-Schwelle", () => {
    expect(
      phasePassesQuality(phase({ konfidenz: "niedrig" }), {
        ...DEFAULT_FILTER,
        konfidenz: "mittel",
      }),
    ).toBe(false);
    expect(
      phasePassesQuality(phase({ konfidenz: "hoch" }), {
        ...DEFAULT_FILTER,
        konfidenz: "hoch",
      }),
    ).toBe(true);
  });
  it("Nur-Höhepunkte-Filter", () => {
    expect(
      phasePassesQuality(phase({ hoehepunkt: false }), {
        ...DEFAULT_FILTER,
        hoehepunktOnly: true,
      }),
    ).toBe(false);
    expect(
      phasePassesQuality(phase({ hoehepunkt: true }), {
        ...DEFAULT_FILTER,
        hoehepunktOnly: true,
      }),
    ).toBe(true);
  });
});
