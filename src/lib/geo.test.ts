import { describe, expect, it } from "vitest";
import { hasCoords, isValidLat, isValidLng, mapUrl, parseCoord } from "@/lib/geo";

describe("isValidLat / isValidLng", () => {
  it("akzeptiert gültige Bereiche", () => {
    expect(isValidLat(48.1)).toBe(true);
    expect(isValidLat(-90)).toBe(true);
    expect(isValidLng(180)).toBe(true);
  });
  it("lehnt Werte außerhalb der Bereiche ab", () => {
    expect(isValidLat(91)).toBe(false);
    expect(isValidLng(-181)).toBe(false);
    expect(isValidLat(Number.NaN)).toBe(false);
  });
});

describe("parseCoord", () => {
  it("leer → null", () => {
    expect(parseCoord("")).toBeNull();
    expect(parseCoord("   ")).toBeNull();
  });
  it("akzeptiert Komma als Dezimaltrenner", () => {
    expect(parseCoord("48,1371")).toBeCloseTo(48.1371);
  });
  it("ungültig → NaN", () => {
    expect(Number.isNaN(parseCoord("abc") as number)).toBe(true);
  });
});

describe("mapUrl", () => {
  it("enthält die Koordinaten", () => {
    const url = mapUrl(48.1, 11.5);
    expect(url).toContain("mlat=48.1");
    expect(url).toContain("mlon=11.5");
  });
});

describe("hasCoords", () => {
  it("true nur bei beiden Werten", () => {
    expect(hasCoords({ lat: 1, lng: 2 })).toBe(true);
    expect(hasCoords({ lat: 1 })).toBe(false);
    expect(hasCoords({})).toBe(false);
  });
});
