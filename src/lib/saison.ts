// Reine Berechnungs-Helfer für den Kalender (PROJ-3).
// Kalenderwochen sind zyklisch (1–53). Diese Funktionen sind seiteneffektfrei
// und damit isoliert unit-testbar.

import { MAX_KW } from "@/lib/kw";
import { Saisonphase } from "@/lib/types";

/** true, wenn die Phase die Kalenderwoche `kw` abdeckt (inkl. Jahresübergang). */
export function isActiveInKW(phase: Saisonphase, kw: number): boolean {
  const { startKW, endKW } = phase;
  if (startKW <= endKW) return kw >= startKW && kw <= endKW;
  // Jahresübergang: z. B. KW 48 → KW 6
  return kw >= startKW || kw <= endKW;
}

/**
 * Zyklische Vorwärts-Distanz (in Wochen) von `currentKW` bis `startKW`.
 * 0 = beginnt diese Woche, 1 = nächste Woche, … (Bereich 0…MAX_KW-1).
 */
export function weeksUntilStart(startKW: number, currentKW: number): number {
  return (((startKW - currentKW) % MAX_KW) + MAX_KW) % MAX_KW;
}

/**
 * „Bevorstehend": Phasenbeginn liegt 1…`within` Wochen voraus und die Phase
 * ist nicht bereits aktiv.
 */
export function isUpcoming(
  phase: Saisonphase,
  currentKW: number,
  within = 4,
): boolean {
  if (isActiveInKW(phase, currentKW)) return false;
  const d = weeksUntilStart(phase.startKW, currentKW);
  return d >= 1 && d <= within;
}
