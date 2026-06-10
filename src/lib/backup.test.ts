import { describe, expect, it } from "vitest";
import {
  backupDateiname,
  buildBackup,
  buildMotivpaket,
  mergeMotivpaket,
  parseEnvelope,
} from "@/lib/backup";
import { Motiv, Saisonphase } from "@/lib/types";

function motiv(id: string, name: string): Motiv {
  return {
    id,
    name,
    kategorie: "Tier",
    tags: [],
    quellen: [],
    erstelltAm: "",
    geaendertAm: "",
  };
}
function phase(id: string, motivId: string): Saisonphase {
  return {
    id,
    motivId,
    startKW: 10,
    endKW: 14,
    konfidenz: "mittel",
    hoehepunkt: false,
    erstelltAm: "",
    geaendertAm: "",
  };
}

describe("buildBackup / buildMotivpaket", () => {
  it("Vollbackup enthält App, Typ, Version, Daten", () => {
    const env = buildBackup("vollbackup", {
      motive: [motiv("1", "A")],
      saisonphasen: [],
    });
    expect(env.app).toBe("naturfoto");
    expect(env.type).toBe("vollbackup");
    expect(env.version).toBe(1);
    expect(env.data.motive).toHaveLength(1);
  });

  it("Motivpaket filtert nur die ausgewählten Motive + deren Phasen", () => {
    const env = buildMotivpaket(
      ["1"],
      [motiv("1", "A"), motiv("2", "B")],
      [phase("p1", "1"), phase("p2", "2")],
    );
    expect(env.type).toBe("motivpaket");
    expect(env.data.motive.map((m) => m.id)).toEqual(["1"]);
    expect(env.data.saisonphasen.map((p) => p.id)).toEqual(["p1"]);
  });
});

describe("Vollbackup mit Fotospots/Fotoeinstellungen", () => {
  it("baut und parst inklusive der Zusatz-Collections (Round-Trip)", () => {
    const env = buildBackup("vollbackup", {
      motive: [motiv("1", "A")],
      saisonphasen: [],
      fotospots: [
        {
          id: "s1",
          name: "Spot",
          motivIds: [],
          tags: [],
          erstelltAm: "",
          geaendertAm: "",
        },
      ],
      fotoeinstellungen: [
        { id: "f1", name: "Vogel im Flug", tags: [], erstelltAm: "", geaendertAm: "" },
      ],
    });
    const parsed = parseEnvelope(JSON.stringify(env));
    expect(parsed.data.fotospots).toHaveLength(1);
    expect(parsed.data.fotoeinstellungen?.[0].name).toBe("Vogel im Flug");
  });
});

describe("backupDateiname", () => {
  it("baut sprechende Namen", () => {
    const d = new Date("2026-06-09T10:00:00Z");
    expect(backupDateiname("vollbackup", d)).toBe("naturfoto-backup-2026-06-09.json");
    expect(backupDateiname("motivpaket", d)).toBe("naturfoto-motive-2026-06-09.json");
  });
});

describe("parseEnvelope", () => {
  const valid = JSON.stringify(
    buildBackup("vollbackup", { motive: [], saisonphasen: [] }),
  );

  it("akzeptiert eine gültige Datei", () => {
    expect(parseEnvelope(valid).type).toBe("vollbackup");
  });
  it("lehnt ungültiges JSON ab", () => {
    expect(() => parseEnvelope("{kaputt")).toThrow("Keine gültige JSON-Datei.");
  });
  it("lehnt fremde Dateien ab", () => {
    expect(() => parseEnvelope(JSON.stringify({ app: "anders" }))).toThrow(
      "Keine Naturfoto-Datei.",
    );
  });
  it("lehnt unbekannte Version ab", () => {
    const bad = JSON.stringify({
      app: "naturfoto",
      type: "vollbackup",
      version: 99,
      exportedAt: "",
      data: { motive: [], saisonphasen: [] },
    });
    expect(() => parseEnvelope(bad)).toThrow("Nicht unterstützte Format-Version");
  });
  it("lehnt beschädigte Daten ab", () => {
    const bad = JSON.stringify({
      app: "naturfoto",
      type: "motivpaket",
      version: 1,
      exportedAt: "",
      data: { motive: "nope" },
    });
    expect(() => parseEnvelope(bad)).toThrow("Beschädigte Datei");
  });
});

describe("mergeMotivpaket", () => {
  const existing = {
    motive: [motiv("e1", "Eisvogel")],
    saisonphasen: [phase("ep1", "e1")],
  };

  it("fügt konfliktfreie Motive hinzu (neue IDs)", () => {
    const incoming = {
      motive: [motiv("i1", "Rotmilan")],
      saisonphasen: [phase("ip1", "i1")],
    };
    const r = mergeMotivpaket(existing, incoming, "ueberspringen");
    expect(r.motive).toHaveLength(2);
    expect(r.summary.hinzugefuegt).toBe(1);
    // Phase wurde auf die neue Motiv-ID umgehängt
    const neu = r.motive.find((m) => m.name === "Rotmilan")!;
    expect(r.saisonphasen.some((p) => p.motivId === neu.id)).toBe(true);
  });

  it("überspringt Namenskonflikte", () => {
    const incoming = { motive: [motiv("i1", "Eisvogel")], saisonphasen: [] };
    const r = mergeMotivpaket(existing, incoming, "ueberspringen");
    expect(r.motive).toHaveLength(1);
    expect(r.summary.uebersprungen).toBe(1);
  });

  it("erstellt bei Duplikat-Strategie einen zweiten Eintrag", () => {
    const incoming = { motive: [motiv("i1", "Eisvogel")], saisonphasen: [] };
    const r = mergeMotivpaket(existing, incoming, "duplikat");
    expect(r.motive.filter((m) => m.name === "Eisvogel")).toHaveLength(2);
    expect(r.summary.hinzugefuegt).toBe(1);
  });

  it("ersetzt das bestehende Motiv samt Phasen", () => {
    const incoming = {
      motive: [motiv("i1", "Eisvogel")],
      saisonphasen: [phase("ip1", "i1")],
    };
    const r = mergeMotivpaket(existing, incoming, "ersetzen");
    expect(r.motive).toHaveLength(1);
    expect(r.summary.ersetzt).toBe(1);
    // alte Phase weg, neue (umgehängte) vorhanden
    expect(r.saisonphasen).toHaveLength(1);
    expect(r.saisonphasen[0].id).not.toBe("ep1");
  });
});
