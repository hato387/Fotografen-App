# PROJ-1: Motive-Datenbank

## Status: In Progress
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

## Dependencies
- None (Fundament-Feature — PROJ-2, PROJ-3, PROJ-4, PROJ-6, PROJ-7, PROJ-8 bauen darauf auf)

## User Stories
- Als Naturfotograf möchte ich ein neues Motiv mit Name und Kategorie anlegen, damit ich meine Sammlung schnell erweitern kann.
- Als Naturfotograf möchte ich ein Motiv nach und nach mit Wissen (Verhalten, Lebensraum, Fototipps, Ethik, Quellen) anreichern, damit mein Wissen an einem Ort wächst.
- Als Naturfotograf möchte ich meine Motive in einer durchsuchbaren Übersicht sehen, damit ich auch bei hunderten Einträgen schnell das richtige finde.
- Als Naturfotograf möchte ich ein Motiv bearbeiten und löschen, damit ich meine Daten aktuell und sauber halte.
- Als Naturfotograf möchte ich Motive mit freien Tags versehen, damit ich quer zu den Kategorien gruppieren kann (z. B. „Makro", „Nachtaktiv").

## Datenmodell (ein Motiv)
- **Name** (Pflicht)
- **Kategorie** (Pflicht): Tier / Pflanze / Landschaft
- **Beschreibung** (optional, Freitext)
- **Verhalten** (optional, Freitext)
- **Lebensraum** (optional, Freitext)
- **Fototipps** (optional, Freitext)
- **Ethikhinweise** (optional, Freitext)
- **Tags** (optional, mehrere freie Schlagwörter)
- **Quellen** (optional, Liste aus *Titel* + *optionalem Link*)
- **Bild-Link** (optional, URL zu Vorschaubild)

## Übersicht
- Karten-Raster: Name, Kategorie-Symbol, Tags, Vorschaubild (falls vorhanden)
- Textsuche (Name; zusätzlich Tags/Beschreibung)
- Filter nach Kategorie (Tier / Pflanze / Landschaft)
- Sortierung alphabetisch nach Name (Standard)
- Klick auf Karte → Detailansicht mit allen Feldern; von dort Bearbeiten/Löschen

## Out of Scope
- Saisonphasen je Motiv → **PROJ-2**
- Kalenderfilter (aktiv/bevorstehend, Relevanz) → **PROJ-3**
- Fotospots, GPS & Beobachtungen (Motive werden dort optional verknüpft) → **PROJ-5** (vereint die frühere Journal-Idee)
- Fotoeinstellungen (eigenständige Sammlung, nicht motivgebunden) → **PROJ-7**
- KI-gestütztes Befüllen von Motiven → **PROJ-8**
- Echtes Bild-Speichern (nur Links in v1)
- Cloud / Sync / Multi-User

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich bin auf der Motiv-Übersicht, wenn ich „Neues Motiv" wähle und Name + Kategorie eingebe und speichere, dann erscheint das Motiv in der Übersicht.
- [ ] Angenommen ich lege ein Motiv an, wenn ich keinen Namen oder keine Kategorie angebe, dann wird das Speichern verhindert und eine Validierungsmeldung pro fehlendem Pflichtfeld angezeigt.
- [ ] Angenommen ein Motiv existiert, wenn ich es öffne, Felder bearbeite und speichere, dann werden die Änderungen übernommen und in der Detailansicht angezeigt.
- [ ] Angenommen ein Motiv existiert, wenn ich auf „Löschen" klicke, dann erscheint ein Bestätigungsdialog, bevor es entfernt wird.
- [ ] Angenommen verknüpfte Daten (z. B. Saisonphasen) existieren, wenn ich ein Motiv lösche, dann warnt der Dialog vor dem Mitlöschen dieser Daten.
- [ ] Angenommen ich gebe einen Suchbegriff ein, wenn er auf Name/Tags/Beschreibung passt, dann zeigt die Übersicht nur die passenden Motive.
- [ ] Angenommen ich wähle einen Kategoriefilter, wenn Motive dieser Kategorie existieren, dann werden nur diese angezeigt.
- [ ] Angenommen ich füge mehrere Quellen hinzu, wenn eine Quelle einen Link hat, dann ist sie in der Detailansicht klickbar; ohne Link wird sie als Text dargestellt.
- [ ] Angenommen noch kein Motiv existiert, wenn ich die Übersicht öffne, dann sehe ich einen Leerzustand mit Hinweis und „Erstes Motiv anlegen"-Button.

## Edge Cases
- **Leerzustand:** Keine Motive → freundlicher Hinweis + CTA zum Anlegen.
- **Doppelte Namen:** erlaubt (kein harter Block) — z. B. regionale Varianten; ggf. dezenter Hinweis.
- **Ungültiger/toter Bild-Link:** Karte/Detail zeigt sauberen Platzhalter statt kaputtem Bild.
- **Sehr lange Texte:** Detailansicht scrollt sauber; Karten kürzen mit „…".
- **localStorage voll/nicht verfügbar:** Fehlermeldung anzeigen, Eingabe bleibt erhalten.
- **Suche ohne Treffer:** klare „Keine Treffer"-Meldung statt leerer Seite.

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Browser-Support: aktuelle Chrome, Firefox, Safari, Edge

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Nur Name + Kategorie als Pflicht | Schnelles Anlegen; Wissen wächst über die Zeit | 2026-06-09 |
| Feste 3er-Kategorie (Tier/Pflanze/Landschaft) + freie Tags | Einheitliches Formular, flexible Feingruppierung | 2026-06-09 |
| Quellen als Liste (Titel + optionaler Link) | Web- und Buchquellen sauber abbildbar | 2026-06-09 |
| Karten-Raster statt Tabelle | Passt zum ruhigen, bildorientierten Design | 2026-06-09 |
| Löschen: Bestätigung + Warnung (kein Block) | Verwaiste Daten vermeiden, Nutzer aber nicht blockieren | 2026-06-09 |

### Technical Decisions
<!-- Added by /architecture -->
| Decision | Rationale | Date |
|----------|-----------|------|
| localStorage statt Server/Supabase | Persönliche App, kein Login/Sync nötig (laut PRD) | 2026-06-09 |
| Geteilte Speicher-Schicht + eigener React-Hook pro Datenart | Eine wiederverwendbare Stelle für Lesen/Schreiben; hält UI aktuell; künftige Features (PROJ-2/5/7) nutzen sie mit | 2026-06-09 |
| Versioniertes Speicherformat von Anfang an | Macht PROJ-4-Backup/Import robust (Format-Version) | 2026-06-09 |
| localStorage-Schlüssel pro Datenart (`naturfoto:motive` …) | Klare Trennung der Collections; einfacher Backup-Export | 2026-06-09 |
| IDs via eingebautes `crypto.randomUUID()` | Kein Zusatzpaket nötig | 2026-06-09 |
| react-hook-form + Zod fürs Formular | Bereits im Stack; saubere Pflichtfeld-Validierung | 2026-06-09 |
| Motiv-Detail als eigene Route `/motive/[id]` | Deep-Links aus Kalender (PROJ-3) und Fotospots (PROJ-5) + sauberer Zurück-Knopf | 2026-06-09 |
| Motive-Übersicht als Startseite `/motive` | Motive sind das Fundament der App | 2026-06-09 |

---

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu angelegt:
- **Theme:** `src/app/globals.css` auf naturnahes Theme umgestellt (Moosgrün/Erdton, Hell/Dunkel); Inter-Font in `layout.tsx` + `tailwind.config.ts`.
- **Datenmodell/Speicher:** `src/lib/types.ts` (Motiv, Kategorie, Quelle), `src/lib/storage.ts` (versionierte localStorage-Schicht, `naturfoto:`-Schlüssel, `createId`), `src/lib/kategorie.ts` (Kategorie-Symbole/Farben).
- **Hooks:** `src/hooks/use-local-collection.ts` (generisch, wiederverwendbar für PROJ-2/5/7), `src/hooks/use-motive.ts`.
- **App-Grundgerüst:** `src/components/main-nav.tsx` (Navigation; künftige Bereiche deaktiviert sichtbar), `theme-provider.tsx`, `theme-toggle.tsx` (Hell/Dunkel via next-themes).
- **Motiv-UI:** `src/components/motive/` — `motiv-card.tsx`, `motiv-form-dialog.tsx` (react-hook-form + Zod, Tags-Input, dynamische Quellen), `motiv-delete-dialog.tsx`, `kategorie-badge.tsx`.
- **Seiten:** `/` → Redirect auf `/motive`; `/motive` (Übersicht: Suche, Kategoriefilter, Karten-Raster, Leerzustand); `/motive/[id]` (Detail mit Bearbeiten/Löschen).

Abweichungen/Hinweise:
- Bild-Links werden bewusst als `<img>` (nicht `next/image`) gerendert, da beliebige externe Hosts erlaubt sind; bei Ladefehler erscheint ein Platzhalter (deckt Edge Case „toter Bild-Link" ab).
- Lösch-Dialog warnt bereits generisch vor verknüpften Daten; die konkrete Zählung folgt mit PROJ-2/5/7.
- Kein Backend (reines localStorage) → nächster Schritt ist QA, nicht `/backend`.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
App-Grundgerüst (neu, einmalig)
└── Navigation (Motive · Kalender · Fotospots · Einstellungen · Backup · KI)
    └── Seite „Motive" (/motive — auch Startseite)
        ├── Kopfzeile: Titel + Button „Neues Motiv"
        ├── Werkzeugleiste: Textsuche + Kategorie-Filter (Tier/Pflanze/Landschaft)
        ├── Karten-Raster der Motive
        │   └── Motiv-Karte: Kategorie-Symbol, Name, Tags, Vorschaubild
        └── Leerzustand: Hinweis + „Erstes Motiv anlegen"

    └── Seite „Motiv-Detail" (/motive/[id])
        ├── Alle Felder (Beschreibung, Verhalten, … Quellen klickbar)
        ├── Button „Bearbeiten" → Formular-Dialog
        └── Button „Löschen" → Bestätigungsdialog (mit Warnung bei verknüpften Daten)

    └── Motiv-Formular (Dialog, für Anlegen & Bearbeiten)
        └── Felder mit Validierung (Name + Kategorie Pflicht)
```

> **Hinweis:** PROJ-1 etabliert zugleich das **App-Grundgerüst** (Navigation) als erstes echtes Feature.

### B) Datenmodell (in Worten)
```
Ein Motiv hat:
- Eindeutige ID (automatisch erzeugt)
- Name (Pflicht)
- Kategorie (Tier | Pflanze | Landschaft, Pflicht)
- Beschreibung, Verhalten, Lebensraum, Fototipps, Ethikhinweise (optionaler Text)
- Tags (optionale Liste von Schlagwörtern)
- Quellen (optionale Liste aus: Titel + optionalem Link)
- Bild-Link (optionale URL)
- Erstellt-am / Geändert-am (Zeitstempel)

Gespeichert in: Browser-localStorage (kein Server).
Schlüssel: "naturfoto:motive" → Liste aller Motive.
```

**Geteiltes Fundament:** Eine kleine Speicher-Schicht mit **Format-Version** und je einem Schlüssel pro Datenart (`naturfoto:motive`, später `naturfoto:saisonphasen`, `naturfoto:fotospots`, `naturfoto:fotoeinstellungen`). Wird von PROJ-2/5/7 mitbenutzt und von PROJ-4 (Backup/Import) als Grundlage genutzt.

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| localStorage statt Server | Persönliche App, kein Login/Sync nötig |
| Eigener „Datenhaken" (React-Hook) pro Datenart | Liest/schreibt localStorage, hält UI aktuell, wiederverwendbar |
| Versioniertes Speicherformat | Robuste PROJ-4-Backups/Importe |
| react-hook-form + Zod | Bereits im Stack; saubere Validierung |
| IDs via `crypto.randomUUID()` | Kein Zusatzpaket |
| Detail als eigene Route | Deep-Links + Zurück-Knopf |

### D) Abhängigkeiten
**Keine neuen Pakete.** Vorhanden: shadcn/ui (card, dialog, alert-dialog, input, textarea, select, badge, form, label, button), Zod, react-hook-form.

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
