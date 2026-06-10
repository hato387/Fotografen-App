// Kalenderwochen-Hilfen (PROJ-2). KW sind zyklisch (1–53, ohne Jahr).
// Die KW→Monat-Zuordnung ist eine Näherung zur Orientierung im UI.

export const MIN_KW = 1;
export const MAX_KW = 53;

/** Alle wählbaren Kalenderwochen [1..53]. */
export const ALLE_KW: number[] = Array.from(
  { length: MAX_KW },
  (_, i) => i + 1,
);

const MONATE_KURZ = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

/** Näherungsweiser Monat (Kurzform) für eine Kalenderwoche. */
export function kwToMonat(week: number): string {
  // Anker: 1. Januar (Referenzjahr); Woche w ≈ Anker + (w-1) Wochen.
  const ref = Date.UTC(2025, 0, 1);
  const d = new Date(ref + (week - 1) * 7 * 86_400_000);
  return MONATE_KURZ[d.getUTCMonth()];
}

/** Label „KW 14 · Apr" für Auswahllisten. */
export function kwLabel(week: number): string {
  return `KW ${week} · ${kwToMonat(week)}`;
}

/**
 * Formatiert eine Phasen-Spanne, z. B. „KW 10–14 (Mär–Apr)".
 * Bei Jahresübergang (start > end) wird das per Pfeil sichtbar.
 */
export function kwSpanne(startKW: number, endKW: number): string {
  const mStart = kwToMonat(startKW);
  const mEnd = kwToMonat(endKW);
  const monate = mStart === mEnd ? mStart : `${mStart}–${mEnd}`;
  return `KW ${startKW}–${endKW} (${monate})`;
}

/** true, wenn die Phase über den Jahreswechsel läuft. */
export function istJahresuebergang(startKW: number, endKW: number): boolean {
  return startKW > endKW;
}
