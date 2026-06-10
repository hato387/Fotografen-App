import { describe, expect, it } from "vitest";
import { Saisonphase } from "@/lib/types";
import { isActiveInKW, isUpcoming, weeksUntilStart } from "@/lib/saison";

function phase(startKW: number, endKW: number): Saisonphase {
  return {
    id: "p",
    motivId: "m",
    startKW,
    endKW,
    konfidenz: "mittel",
    hoehepunkt: false,
    erstelltAm: "",
    geaendertAm: "",
  };
}

describe("isActiveInKW", () => {
  it("normale Spanne", () => {
    expect(isActiveInKW(phase(10, 14), 12)).toBe(true);
    expect(isActiveInKW(phase(10, 14), 10)).toBe(true);
    expect(isActiveInKW(phase(10, 14), 14)).toBe(true);
    expect(isActiveInKW(phase(10, 14), 9)).toBe(false);
    expect(isActiveInKW(phase(10, 14), 15)).toBe(false);
  });

  it("einzelne Woche", () => {
    expect(isActiveInKW(phase(20, 20), 20)).toBe(true);
    expect(isActiveInKW(phase(20, 20), 21)).toBe(false);
  });

  it("Jahresübergang (start > end)", () => {
    const p = phase(48, 6);
    expect(isActiveInKW(p, 50)).toBe(true);
    expect(isActiveInKW(p, 2)).toBe(true);
    expect(isActiveInKW(p, 48)).toBe(true);
    expect(isActiveInKW(p, 6)).toBe(true);
    expect(isActiveInKW(p, 7)).toBe(false);
    expect(isActiveInKW(p, 30)).toBe(false);
  });
});

describe("weeksUntilStart", () => {
  it("0 wenn diese Woche beginnt", () => {
    expect(weeksUntilStart(10, 10)).toBe(0);
  });
  it("Vorwärts-Distanz", () => {
    expect(weeksUntilStart(14, 10)).toBe(4);
  });
  it("zyklisch über den Jahreswechsel", () => {
    expect(weeksUntilStart(2, 51)).toBe(4); // 51→52→53→1→2
  });
});

describe("isUpcoming", () => {
  it("erkennt eine bald beginnende Phase", () => {
    expect(isUpcoming(phase(14, 20), 10, 4)).toBe(true);
  });
  it("nicht bevorstehend, wenn schon aktiv", () => {
    expect(isUpcoming(phase(8, 20), 10, 4)).toBe(false);
  });
  it("nicht bevorstehend, wenn zu weit weg", () => {
    expect(isUpcoming(phase(20, 24), 10, 4)).toBe(false);
  });
});
