"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Aussagekräftiger Browser-Tab-Titel je Bereich (sonst überall identisch).
const TITLES: { test: (p: string) => boolean; title: string }[] = [
  { test: (p) => p === "/", title: "Übersicht" },
  { test: (p) => p.startsWith("/motive/"), title: "Motiv-Detail" },
  { test: (p) => p === "/motive", title: "Motive – Arten & Landschaften" },
  { test: (p) => p === "/kalender", title: "Saison-Kalender" },
  { test: (p) => p.startsWith("/fotospots/"), title: "Fotospot-Detail" },
  { test: (p) => p === "/fotospots", title: "Fotospots & Beobachtungen" },
  {
    test: (p) => p === "/fotoeinstellungen",
    title: "Fotoeinstellungen – Kamera-Rezepte",
  },
  { test: (p) => p === "/backup", title: "Backup & Import" },
  { test: (p) => p === "/ki-import", title: "KI-Motiv-Import" },
];

export function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const match = TITLES.find((t) => t.test(pathname));
    document.title = match
      ? `${match.title} · Naturfoto`
      : "Naturfoto – Naturfotografie-Planer";
  }, [pathname]);

  return null;
}
