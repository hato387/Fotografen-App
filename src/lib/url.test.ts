import { describe, expect, it } from "vitest";
import { isSafeHttpUrl, sanitizeUrl } from "@/lib/url";

describe("isSafeHttpUrl", () => {
  it("akzeptiert http und https", () => {
    expect(isSafeHttpUrl("http://example.com")).toBe(true);
    expect(isSafeHttpUrl("https://www.nabu.de")).toBe(true);
  });

  it("lehnt gefährliche/andere Schemata ab", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeHttpUrl("ftp://example.com")).toBe(false);
  });

  it("lehnt leere/ungültige Werte ab", () => {
    expect(isSafeHttpUrl("")).toBe(false);
    expect(isSafeHttpUrl(undefined)).toBe(false);
    expect(isSafeHttpUrl("kein-url")).toBe(false);
  });
});

describe("sanitizeUrl", () => {
  it("gibt sichere URLs zurück", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("verwirft unsichere URLs (undefined)", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeUndefined();
    expect(sanitizeUrl("")).toBeUndefined();
    expect(sanitizeUrl(undefined)).toBeUndefined();
  });

  it("trimmt Eingaben", () => {
    expect(sanitizeUrl("  https://example.com  ")).toBe("https://example.com");
  });
});
