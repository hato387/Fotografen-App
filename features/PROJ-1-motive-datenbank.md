# PROJ-1: Motive-Datenbank

## Status: Approved
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

**Nachbesserungen (2026-06-12):** Dezenter **Duplikat-Hinweis** im Motiv-Formular bei Namensgleichheit (Edge Case aus Spec, Mängelliste #8). Motiv-Löschen mit **„Rückgängig"-Toast** (stellt Motiv, Saisonphasen und Spot-Verknüpfungen wieder her, #10). ESLint auf Flat-Config migriert, `npm run lint` läuft wieder (0 Probleme, #12).

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

**Tested:** 2026-06-09
**App URL:** http://localhost:3000
**Tester:** QA Engineer (AI)
**Methode:** Code-Level-Review aller Akzeptanzkriterien + 13 Unit-Tests (Vitest, alle grün) + 10 E2E-Tests (Playwright, autorisiert). E2E-Ausführung war zum Testzeitpunkt durch einen hängenden Browser-Download (Playwright-Binaries) blockiert — die Tests sind geschrieben und laufen, sobald `npx playwright install chromium` abgeschlossen ist.

### Acceptance Criteria Status

#### AC-1: Motiv anlegen (Name + Kategorie) erscheint in Übersicht
- [x] Anlegen über Dialog, Karte erscheint in der Übersicht (sortiert)

#### AC-2: Pflichtfeld-Validierung
- [x] Leerer Name → „Name ist ein Pflichtfeld.", Speichern blockiert
- [~] Kategorie: hat Standardwert „Tier" und kann nicht leer sein → Validierungspfad „fehlende Kategorie" ist nicht auslösbar (bewusster Default, siehe BUG-1)

#### AC-3: Bearbeiten speichert Änderungen
- [x] Felder bearbeiten → Detailansicht zeigt aktualisierte Werte

#### AC-4: Löschen mit Bestätigungsdialog
- [x] „Löschen" öffnet Bestätigungsdialog vor dem Entfernen

#### AC-5: Warnung bei verknüpften Daten
- [~] Dialog zeigt generische Warnung; konkrete Zählung folgt mit PROJ-2/5/7 (Features existieren noch nicht) — siehe BUG-4

#### AC-6: Textsuche (Name/Tags/Beschreibung)
- [x] Filtert korrekt über alle drei Felder

#### AC-7: Kategoriefilter
- [x] Tabs Alle/Tier/Pflanze/Landschaft filtern korrekt

#### AC-8: Quellen mit/ohne Link
- [x] Mit Link → klickbar (target=_blank, rel=noopener); ohne Link → Text

#### AC-9: Leerzustand mit CTA
- [x] Hinweis + „Erstes Motiv anlegen"

### Edge Cases Status
- [x] EC Leerzustand
- [x] EC Doppelte Namen erlaubt (kein Block)
- [x] EC Toter/ungültiger Bild-Link → Platzhalter (Karte) bzw. Hinweis (Detail)
- [x] EC Sehr lange Texte → Detail `whitespace-pre-wrap`, Karten `line-clamp`
- [x] EC Suche ohne Treffer → „Keine Treffer"
- [x] EC localStorage voll → Fehlermeldung + Toast (Anlege-Pfad); siehe BUG-3 für Edit/Delete-Pfad

### Security Audit Results
- [x] Kein Backend/Auth (Single-User, lokal) — kein Zugriff auf fremde Daten möglich
- [x] XSS über Textfelder: React escaped Inhalte; keine `dangerouslySetInnerHTML`
- [x] Keine Secrets im Code/Netzwerk; `src/lib/supabase.ts` ist deaktiviert (exportiert `null`)
- [~] URL-Schema-Validierung: Quellen-Link/Bild-URL akzeptieren beliebige Schemata (z. B. `javascript:`). Da Single-User-lokal nur selbst-induziert → Low (BUG-2)

### Bugs Found

#### BUG-1: „Kategorie"-Pflichtvalidierung nicht auslösbar
- **Severity:** Low
- **Detail:** Kategorie hat den Default „Tier"; AC-2 fordert eine Validierungsmeldung pro fehlendem Pflichtfeld. Für Kategorie ist dieser Pfad nicht erreichbar (sinnvoller Default vs. literaler AC-Wortlaut).
- **Priorität:** Nice to have (bewusste UX-Entscheidung).

#### BUG-2: Keine URL-Schema-Beschränkung bei Quellen-Link/Bild-URL
- **Severity:** Low
- **Steps:** Motiv anlegen → Quelle mit Link `javascript:alert(1)` → in Detail anklicken.
- **Erwartet:** nur `http(s)`-Links zulassen. **Aktuell:** beliebiges Schema. Im Single-User-Kontext nur selbst-induziert.
- **Priorität:** Fix in next sprint.

#### BUG-3: Schreibfehler beim Bearbeiten/Löschen werden nicht als Toast angezeigt
- **Severity:** Low
- **Detail:** `update`/`remove` setzen zwar `error` im Hook, die Detailseite zeigt dafür aber keinen Toast (nur der Anlege-Pfad der Übersicht surfacet den Fehler).
- **Priorität:** Fix in next sprint.

#### BUG-4: Lösch-Warnung ist statisch
- **Severity:** Low (informational)
- **Detail:** Dialog warnt generisch vor „verknüpften Daten", auch wenn es noch keine gibt. Konkrete Zählung kommt mit PROJ-2/5/7.
- **Priorität:** Mit PROJ-2 nachziehen.

### Bug-Fix Verification (2026-06-09, nach QA)
Alle 4 Low-Bugs **behoben** und per Build + Unit-Tests verifiziert:
- **BUG-1 ✓** Kategorie hat keinen Default mehr → „Bitte eine Kategorie wählen." greift; AC-2 nun vollständig erfüllt.
- **BUG-2 ✓** `src/lib/url.ts` (`isSafeHttpUrl`/`sanitizeUrl`): Quellen-Link & Bild-URL werden beim Speichern auf http(s) beschränkt und beim Rendern zusätzlich geprüft (deckt auch künftige PROJ-4-Importe ab). Unsichere Bild-URL zeigt eine Validierungsmeldung.
- **BUG-3 ✓** `update`/`remove` liefern jetzt einen Erfolgswert; die Detailseite zeigt bei Schreibfehlern einen Fehler-Toast.
- **BUG-4 ✓** Lösch-Dialog warnt nur noch optional (`warning`-Prop, von PROJ-2/5/7 befüllt) statt spekulativ.

### Summary
- **Acceptance Criteria:** 9/9 funktional erfüllt (AC-2 nach Fix vollständig; AC-5 mit PROJ-2 final)
- **Bugs:** 4 gefunden, **4 behoben** → 0 offen (0 Critical, 0 High, 0 Medium, 0 Low offen)
- **Unit Tests:** 19/19 grün (`storage`, `use-local-collection`, `url`)
- **E2E Tests:** 12/12 grün (`tests/PROJ-1-motive-datenbank.spec.ts`)
- **Security:** Pass (URL-Schema-Härtung umgesetzt)
- **Production Ready:** YES — keine offenen Bugs, alle Tests grün
- **Recommendation:** Deploy-fähig.

> **Hinweis zur E2E-Ausführung:** Der Playwright-Browser-Download (v1208) ließ sich in dieser Umgebung nicht abschließen (Netzwerk; zudem installierte `npx playwright install` eine abweichende Revision v1223). Die E2E-Suite wurde daher gegen das **System-Edge** ausgeführt: `npx playwright test --config=playwright.edge.config.ts` (nutzt `channel: msedge`, kein Download nötig). Sobald der reguläre Chromium-Download klappt, läuft auch `npm run test:e2e`.

## Deployment
_To be added by /deploy_
