import { describe, expect, it } from "vitest";
import {
  ALLE_KW,
  istJahresuebergang,
  kwLabel,
  kwSpanne,
  kwToMonat,
} from "@/lib/kw";

describe("ALLE_KW", () => {
  it("enthält die Wochen 1 bis 53", () => {
    expect(ALLE_KW).toHaveLength(53);
    expect(ALLE_KW[0]).toBe(1);
    expect(ALLE_KW[52]).toBe(53);
  });
});

describe("kwToMonat", () => {
  it("ordnet Wochen plausiblen Monaten zu", () => {
    expect(kwToMonat(1)).toBe("Jan");
    expect(kwToMonat(14)).toBe("Apr");
    expect(kwToMonat(53)).toBe("Dez");
  });
});

describe("kwLabel", () => {
  it("formatiert „KW n · Monat“", () => {
    expect(kwLabel(1)).toBe("KW 1 · Jan");
  });
});

describe("kwSpanne", () => {
  it("zeigt unterschiedliche Monate als Spanne", () => {
    expect(kwSpanne(10, 14)).toBe("KW 10–14 (Mär–Apr)");
  });

  it("zeigt einen einzelnen Monat ohne Spanne", () => {
    expect(kwSpanne(20, 20)).toBe("KW 20–20 (Mai)");
  });
});

describe("istJahresuebergang", () => {
  it("erkennt Jahresübergang (start > end)", () => {
    expect(istJahresuebergang(48, 6)).toBe(true);
  });

  it("ist false bei normaler Reihenfolge", () => {
    expect(istJahresuebergang(10, 14)).toBe(false);
    expect(istJahresuebergang(20, 20)).toBe(false);
  });
});
