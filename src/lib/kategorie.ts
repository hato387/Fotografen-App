import { Kategorie } from "@/lib/types";

/** Anzeige-Metadaten je Kategorie (Symbol + Badge-Farben, naturnah). */
export const KATEGORIE_META: Record<
  Kategorie,
  { label: Kategorie; icon: string; badgeClass: string }
> = {
  Tier: {
    label: "Tier",
    icon: "🦋",
    badgeClass:
      "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  Pflanze: {
    label: "Pflanze",
    icon: "🌿",
    badgeClass:
      "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  Landschaft: {
    label: "Landschaft",
    icon: "🏞️",
    badgeClass:
      "border-transparent bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  },
};
