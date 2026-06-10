import { Konfidenz } from "@/lib/types";

/** Anzeige-Metadaten je Konfidenzstufe (Badge-Farben, naturnah). */
export const KONFIDENZ_META: Record<
  Konfidenz,
  { label: string; badgeClass: string }
> = {
  niedrig: {
    label: "niedrig",
    badgeClass:
      "border-transparent bg-muted text-muted-foreground",
  },
  mittel: {
    label: "mittel",
    badgeClass:
      "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200",
  },
  hoch: {
    label: "hoch",
    badgeClass:
      "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200",
  },
};
