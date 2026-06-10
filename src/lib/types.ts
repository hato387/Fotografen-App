// Geteilte Datentypen der Naturfoto-App.
// Werden über localStorage persistiert (siehe src/lib/storage.ts).

export type Kategorie = "Tier" | "Pflanze" | "Landschaft";

export const KATEGORIEN: Kategorie[] = ["Tier", "Pflanze", "Landschaft"];

/** Eine Quelle: Titel ist Pflicht, Link optional (für Web- oder Buchquellen). */
export interface Quelle {
  titel: string;
  link?: string;
}

/** Ein Motiv (PROJ-1) — das Fundament der App. */
export interface Motiv {
  id: string;
  name: string;
  kategorie: Kategorie;
  beschreibung?: string;
  verhalten?: string;
  lebensraum?: string;
  fototipps?: string;
  ethikhinweise?: string;
  tags: string[];
  quellen: Quelle[];
  bildUrl?: string;
  erstelltAm: string; // ISO-Datum
  geaendertAm: string; // ISO-Datum
}

export type Konfidenz = "niedrig" | "mittel" | "hoch";

export const KONFIDENZEN: Konfidenz[] = ["niedrig", "mittel", "hoch"];

/**
 * Eine Saisonphase (PROJ-2) — gehört zu genau einem Motiv (motivId).
 * Zeitfenster als Kalenderwochen, zyklisch: startKW > endKW = Jahresübergang.
 */
export interface Saisonphase {
  id: string;
  motivId: string;
  bezeichnung?: string;
  startKW: number; // 1–53
  endKW: number; // 1–53
  region?: string;
  konfidenz: Konfidenz;
  hoehepunkt: boolean;
  notiz?: string;
  erstelltAm: string; // ISO-Datum
  geaendertAm: string; // ISO-Datum
}

/**
 * Ein Fotospot (PROJ-5) — vereint Ort + Beobachtungen/Ideen.
 * GPS optional; verknüpfte Motive lose über IDs.
 */
export interface Fotospot {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  motivIds: string[];
  beobachtungen?: string;
  besteZeit?: string;
  tags: string[];
  bildUrl?: string;
  erstelltAm: string;
  geaendertAm: string;
}

/**
 * Eine Fotoeinstellung (PROJ-7) — eigenständiges Kamera-Rezept, selbst benannt.
 * Nicht motivgebunden. Kamera-Werte als Freitext (variable Schreibweisen).
 */
export interface Fotoeinstellung {
  id: string;
  name: string;
  blende?: string;
  belichtungszeit?: string;
  iso?: string;
  brennweite?: string;
  ausruestung?: string;
  notiz?: string;
  tags: string[];
  erstelltAm: string;
  geaendertAm: string;
}
