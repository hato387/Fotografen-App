// KI-Motiv-Prompt-Generator & Import (PROJ-8). Reine Logik → unit-testbar.
// Erzeugt einen Prompt und verarbeitet die (uneinheitliche) KI-Antwort robust
// in das Motivpaket-Format (BackupData) aus PROJ-4.

import { BackupData } from "@/lib/backup";
import { createId } from "@/lib/storage";
import {
  Kategorie,
  KATEGORIEN,
  Konfidenz,
  KONFIDENZEN,
  Motiv,
  Quelle,
  Saisonphase,
} from "@/lib/types";

export interface KiHints {
  name: string;
  kategorie?: Kategorie | "";
  region?: string;
}

/** Baut den strukturierten Prompt für eine beliebige KI. */
export function buildPrompt(h: KiHints): string {
  const name = h.name.trim();
  const lines = [
    `Du bist Experte für Naturfotografie und Artenkenntnis. Erstelle strukturierte Daten zum Motiv „${name}".`,
  ];
  if (h.kategorie) lines.push(`Kategorie: ${h.kategorie}.`);
  if (h.region?.trim())
    lines.push(`Region für die Saisonphasen: ${h.region.trim()}.`);
  lines.push(
    "",
    "Gib AUSSCHLIESSLICH gültiges JSON in genau diesem Format zurück (kein Text davor oder danach):",
    `{
  "app": "naturfoto",
  "type": "motivpaket",
  "version": 1,
  "data": {
    "motive": [{
      "name": "${name}",
      "kategorie": "Tier | Pflanze | Landschaft",
      "beschreibung": "",
      "verhalten": "",
      "lebensraum": "",
      "fototipps": "",
      "ethikhinweise": "",
      "tags": [],
      "quellen": [{ "titel": "", "link": "" }]
    }],
    "saisonphasen": [{
      "bezeichnung": "z. B. Balz / Blüte",
      "startKW": 1,
      "endKW": 53,
      "region": "",
      "konfidenz": "niedrig | mittel | hoch",
      "hoehepunkt": false,
      "notiz": ""
    }]
  }
}`,
    "",
    "Regeln: startKW/endKW sind Kalenderwochen 1–53 (Start größer als Ende = über den Jahreswechsel). Konfidenz nur niedrig, mittel oder hoch. Nenne realistische Quellen (ich prüfe sie selbst). Fülle nur, was du fachlich vertreten kannst — Unbekanntes leer lassen.",
  );
  return lines.join("\n");
}

/** Holt ein JSON-Objekt aus einem Text (toleriert Beifang davor/danach). */
export function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        /* fällt unten durch */
      }
    }
  }
  throw new Error("Keine gültigen Motivdaten erkannt.");
}

function asString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim() !== "");
}

function asQuellen(v: unknown): Quelle[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((q) => {
      const o = q as Record<string, unknown>;
      const titel = asString(o?.titel);
      if (!titel) return null;
      const link = asString(o?.link);
      return link ? { titel, link } : { titel };
    })
    .filter((q): q is Quelle => q !== null);
}

function isKategorie(v: unknown): v is Kategorie {
  return typeof v === "string" && (KATEGORIEN as string[]).includes(v);
}
function isKonfidenz(v: unknown): v is Konfidenz {
  return typeof v === "string" && (KONFIDENZEN as string[]).includes(v);
}

function asKW(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 53) return null;
  return n;
}

function sanitizePhase(
  raw: unknown,
  motivId: string,
  now: string,
): Saisonphase | null {
  const o = raw as Record<string, unknown>;
  const startKW = asKW(o?.startKW);
  const endKW = asKW(o?.endKW);
  if (startKW === null || endKW === null) return null;
  return {
    id: createId(),
    motivId,
    bezeichnung: asString(o?.bezeichnung),
    startKW,
    endKW,
    region: asString(o?.region),
    konfidenz: isKonfidenz(o?.konfidenz) ? o.konfidenz : "mittel",
    hoehepunkt: o?.hoehepunkt === true,
    notiz: asString(o?.notiz),
    erstelltAm: now,
    geaendertAm: now,
  };
}

/**
 * Normalisiert eine geparste KI-Antwort zu BackupData. Akzeptiert:
 * Envelope, `{motive,saisonphasen}` oder ein einzelnes Motiv-Objekt.
 * Erzwingt Pflichtfelder, prüft KW/Konfidenz, vergibt neue IDs.
 */
export function normalizeKiImport(parsed: unknown): BackupData {
  const obj = parsed as Record<string, unknown>;
  let rawMotive: unknown;
  let rawPhasen: unknown;

  const data = obj?.data as Record<string, unknown> | undefined;
  if (data && Array.isArray(data.motive)) {
    rawMotive = data.motive;
    rawPhasen = data.saisonphasen;
  } else if (Array.isArray(obj?.motive)) {
    rawMotive = obj.motive;
    rawPhasen = obj.saisonphasen;
  } else if (asString(obj?.name)) {
    rawMotive = [obj];
    rawPhasen = (obj as Record<string, unknown>).saisonphasen;
  } else {
    throw new Error("Keine gültigen Motivdaten erkannt.");
  }

  if (!Array.isArray(rawMotive) || rawMotive.length === 0) {
    throw new Error("Keine gültigen Motivdaten erkannt.");
  }

  const now = new Date().toISOString();
  const motive: Motiv[] = [];

  for (const rm of rawMotive) {
    const o = rm as Record<string, unknown>;
    const name = asString(o?.name);
    if (!name) continue;
    motive.push({
      id: createId(),
      name,
      kategorie: isKategorie(o?.kategorie) ? o.kategorie : "Tier",
      beschreibung: asString(o?.beschreibung),
      verhalten: asString(o?.verhalten),
      lebensraum: asString(o?.lebensraum),
      fototipps: asString(o?.fototipps),
      ethikhinweise: asString(o?.ethikhinweise),
      tags: asStringArray(o?.tags),
      quellen: asQuellen(o?.quellen),
      bildUrl: undefined,
      erstelltAm: now,
      geaendertAm: now,
    });
  }

  if (motive.length === 0) {
    throw new Error("Keine gültigen Motivdaten erkannt.");
  }

  // Ein Motiv pro Prompt: alle Phasen an das erste Motiv hängen.
  const targetId = motive[0].id;
  const saisonphasen: Saisonphase[] = [];
  if (Array.isArray(rawPhasen)) {
    for (const rp of rawPhasen) {
      const s = sanitizePhase(rp, targetId, now);
      if (s) saisonphasen.push(s);
    }
  }

  return { motive, saisonphasen };
}
