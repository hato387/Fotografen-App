import { Kategorie } from "@/lib/types";

/** Anzeige-Metadaten je Kategorie (Symbol, Badge- & Flächenfarben, naturnah). */
export const KATEGORIE_META: Record<
  Kategorie,
  {
    label: Kategorie;
    icon: string;
    /** Badge / Chip */
    badgeClass: string;
    /** Weicher Verlauf für Platzhalter-Flächen */
    gradientClass: string;
    /** Akzent-Textfarbe */
    accentClass: string;
    /** Vollfarbe für Timeline-Balken */
    barClass: string;
  }
> = {
  Tier: {
    label: "Tier",
    icon: "🦋",
    badgeClass:
      "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200",
    gradientClass:
      "from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-background",
    accentClass: "text-amber-600 dark:text-amber-300",
    barClass: "bg-amber-400/85 dark:bg-amber-500/70",
  },
  Pflanze: {
    label: "Pflanze",
    icon: "🌿",
    badgeClass:
      "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200",
    gradientClass:
      "from-emerald-100 to-emerald-50 dark:from-emerald-950/40 dark:to-background",
    accentClass: "text-emerald-600 dark:text-emerald-300",
    barClass: "bg-emerald-500/85 dark:bg-emerald-500/70",
  },
  Landschaft: {
    label: "Landschaft",
    icon: "🏞️",
    badgeClass:
      "border-transparent bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-200",
    gradientClass:
      "from-sky-100 to-sky-50 dark:from-sky-950/40 dark:to-background",
    accentClass: "text-sky-600 dark:text-sky-300",
    barClass: "bg-sky-400/85 dark:bg-sky-500/70",
  },
};
