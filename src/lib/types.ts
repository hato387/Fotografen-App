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
