import { beforeEach, describe, expect, it } from "vitest";
import {
  createId,
  readCollection,
  storageKey,
  writeCollection,
} from "@/lib/storage";

interface Item {
  id: string;
  name: string;
}

beforeEach(() => {
  localStorage.clear();
});

describe("readCollection", () => {
  it("gibt ein leeres Array zurück, wenn nichts gespeichert ist", () => {
    expect(readCollection<Item>("motive")).toEqual([]);
  });

  it("liest zurück, was geschrieben wurde (Roundtrip)", () => {
    const items: Item[] = [
      { id: "1", name: "Eisvogel" },
      { id: "2", name: "Buschwindröschen" },
    ];
    writeCollection<Item>("motive", items);
    expect(readCollection<Item>("motive")).toEqual(items);
  });

  it("gibt bei beschädigtem JSON ein leeres Array zurück (kein Absturz)", () => {
    localStorage.setItem(storageKey("motive"), "{kein valides json");
    expect(readCollection<Item>("motive")).toEqual([]);
  });

  it("gibt bei Nicht-Array-Inhalt ein leeres Array zurück", () => {
    localStorage.setItem(storageKey("motive"), JSON.stringify({ foo: "bar" }));
    expect(readCollection<Item>("motive")).toEqual([]);
  });
});

describe("writeCollection", () => {
  it("setzt die Format-Version beim ersten Schreiben", () => {
    writeCollection<Item>("motive", [{ id: "1", name: "Eisvogel" }]);
    expect(localStorage.getItem("naturfoto:version")).toBe("1");
  });
});

describe("createId", () => {
  it("erzeugt nicht-leere, eindeutige IDs", () => {
    const a = createId();
    const b = createId();
    expect(a).toBeTruthy();
    expect(a).not.toBe(b);
  });
});
