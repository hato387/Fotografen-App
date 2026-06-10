// Filter-Logik für den Kalender (PROJ-3). Reine Funktionen → unit-testbar.

import { Kategorie, Konfidenz, Motiv, Saisonphase } from "@/lib/types";

export type StatusFilter = "alle" | "aktiv" | "bevorstehend";
export type KonfidenzFilter = "alle" | "mittel" | "hoch";

export interface KalenderFilter {
  query: string;
  status: StatusFilter;
  konfidenz: KonfidenzFilter;
  hoehepunktOnly: boolean;
  kategorie: "Alle" | Kategorie;
  tags: string[];
}

export const DEFAULT_FILTER: KalenderFilter = {
  query: "",
  status: "alle",
  konfidenz: "alle",
  hoehepunktOnly: false,
  kategorie: "Alle",
  tags: [],
};

const KONFIDENZ_RANK: Record<Konfidenz, number> = {
  niedrig: 0,
  mittel: 1,
  hoch: 2,
};

/** Prüft, ob eine Phase die Qualitätsfilter (Konfidenz, Höhepunkt) erfüllt. */
export function phasePassesQuality(
  p: Saisonphase,
  filter: KalenderFilter,
): boolean {
  if (filter.hoehepunktOnly && !p.hoehepunkt) return false;
  const min = filter.konfidenz === "hoch" ? 2 : filter.konfidenz === "mittel" ? 1 : 0;
  return KONFIDENZ_RANK[p.konfidenz] >= min;
}

/** Prüft, ob ein Motiv die Motiv-Filter (Kategorie, Text, Tags) erfüllt. */
export function motivPasses(m: Motiv, filter: KalenderFilter): boolean {
  if (filter.kategorie !== "Alle" && m.kategorie !== filter.kategorie) {
    return false;
  }
  const q = filter.query.trim().toLowerCase();
  if (
    q &&
    !m.name.toLowerCase().includes(q) &&
    !m.tags.some((t) => t.toLowerCase().includes(q))
  ) {
    return false;
  }
  if (filter.tags.length > 0 && !filter.tags.every((t) => m.tags.includes(t))) {
    return false;
  }
  return true;
}
