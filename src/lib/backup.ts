// Backup/Import-Logik (PROJ-4). Reine Funktionen → unit-testbar.
// Datei-Format: versioniertes Envelope { app, type, version, exportedAt, data }.

import { createId, STORAGE_VERSION } from "@/lib/storage";
import { Motiv, Saisonphase } from "@/lib/types";

export const APP_ID = "naturfoto";

export type BackupType = "vollbackup" | "motivpaket";
export type Konfliktstrategie = "ueberspringen" | "duplikat" | "ersetzen";

export interface BackupData {
  motive: Motiv[];
  saisonphasen: Saisonphase[];
}

export interface BackupEnvelope {
  app: typeof APP_ID;
  type: BackupType;
  version: number;
  exportedAt: string;
  data: BackupData;
}

/** Baut ein Envelope für Export. */
export function buildBackup(type: BackupType, data: BackupData): BackupEnvelope {
  return {
    app: APP_ID,
    type,
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

/** Datenschutzbereinigtes Motivpaket aus ausgewählten Motiven (+ deren Phasen). */
export function buildMotivpaket(
  motivIds: string[],
  motive: Motiv[],
  saisonphasen: Saisonphase[],
): BackupEnvelope {
  const ids = new Set(motivIds);
  return buildBackup("motivpaket", {
    motive: motive.filter((m) => ids.has(m.id)),
    saisonphasen: saisonphasen.filter((p) => ids.has(p.motivId)),
  });
}

/** Sprechender Dateiname für den Download. */
export function backupDateiname(type: BackupType, date: Date = new Date()): string {
  const tag = date.toISOString().slice(0, 10);
  const teil = type === "vollbackup" ? "backup" : "motive";
  return `naturfoto-${teil}-${tag}.json`;
}

/** Parst und validiert eine Importdatei. Wirft mit klarer Meldung bei Fehlern. */
export function parseEnvelope(text: string): BackupEnvelope {
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error("Keine gültige JSON-Datei.");
  }
  const e = obj as Partial<BackupEnvelope>;
  if (!e || typeof e !== "object" || e.app !== APP_ID) {
    throw new Error("Keine Naturfoto-Datei.");
  }
  if (e.type !== "vollbackup" && e.type !== "motivpaket") {
    throw new Error("Unbekannter Dateityp.");
  }
  if (e.version !== STORAGE_VERSION) {
    throw new Error(`Nicht unterstützte Format-Version (${e.version}).`);
  }
  if (
    !e.data ||
    !Array.isArray(e.data.motive) ||
    !Array.isArray(e.data.saisonphasen)
  ) {
    throw new Error("Beschädigte Datei — Daten fehlen.");
  }
  return e as BackupEnvelope;
}

export interface MergeSummary {
  hinzugefuegt: number;
  uebersprungen: number;
  ersetzt: number;
}

export interface MergeResult {
  motive: Motiv[];
  saisonphasen: Saisonphase[];
  summary: MergeSummary;
}

/**
 * Führt ein Motivpaket mit dem Bestand zusammen. Namenskonflikte werden gemäß
 * Strategie behandelt. Importierte Einträge erhalten neue IDs (keine Kollision).
 */
export function mergeMotivpaket(
  existing: BackupData,
  incoming: BackupData,
  strategie: Konfliktstrategie,
): MergeResult {
  let motive = [...existing.motive];
  let saisonphasen = [...existing.saisonphasen];
  const summary: MergeSummary = {
    hinzugefuegt: 0,
    uebersprungen: 0,
    ersetzt: 0,
  };

  for (const im of incoming.motive) {
    const konflikt = motive.find(
      (m) => m.name.toLowerCase() === im.name.toLowerCase(),
    );
    const importPhasen = incoming.saisonphasen.filter(
      (p) => p.motivId === im.id,
    );

    if (konflikt) {
      if (strategie === "ueberspringen") {
        summary.uebersprungen++;
        continue;
      }
      if (strategie === "ersetzen") {
        motive = motive.filter((m) => m.id !== konflikt.id);
        saisonphasen = saisonphasen.filter((p) => p.motivId !== konflikt.id);
        summary.ersetzt++;
      } else {
        summary.hinzugefuegt++; // Duplikat
      }
    } else {
      summary.hinzugefuegt++;
    }

    const neueId = createId();
    motive.push({ ...im, id: neueId });
    for (const p of importPhasen) {
      saisonphasen.push({ ...p, id: createId(), motivId: neueId });
    }
  }

  return { motive, saisonphasen, summary };
}
