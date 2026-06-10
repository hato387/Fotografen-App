# PROJ-3: Kalender

## Status: Approved
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

## Dependencies
- **PROJ-1** (Motive-Datenbank) und **PROJ-2** (Saisonphasen) — der Kalender visualisiert Phasen je Motiv

## User Stories
- Als Naturfotograf möchte ich in einer Wochenansicht sehen, welche Motive *jetzt* aktiv sind, damit ich kurzfristig planen kann.
- Als Naturfotograf möchte ich in einer Jahres-Timeline alle Phasen über das Jahr als Balken sehen, damit ich langfristig planen kann.
- Als Naturfotograf möchte ich zwischen beiden Ansichten umschalten, damit ich je nach Bedarf den passenden Blick habe.
- Als Naturfotograf möchte ich filtern (Status, Konfidenz, Höhepunkt, Kategorie, Tags, Text), damit ich gezielt finde, was sich lohnt.
- Als Naturfotograf möchte ich von einem Eintrag direkt zum Motiv springen, damit ich Details und Fototipps sehe.

## Ansichten
**📅 Wochenansicht**
- Zeigt die aktuelle KW (aus Systemdatum); Blättern KW vor/zurück möglich.
- Listet alle Motive mit in dieser KW **aktiver** Phase (Karten/Liste: Phasen-Bezeichnung, Konfidenz, Region, Höhepunkt-Markierung).
- Zusätzlicher Block „Bevorstehend" (Phasen, die in den nächsten 4 Wochen beginnen).

**📈 Jahres-Timeline**
- Horizontale Leiste über alle KW (1–53), mit **Monatsbeschriftung** darüber.
- Pro Motiv eine Zeile; Phasen als **farbige Balken** über ihr Zeitfenster (Jahresübergang läuft umlaufend weiter).
- **Markierung der aktuellen KW** (senkrechte Linie).

**Umschalten** per Tab/Toggle. Filter wirken auf **beide** Ansichten.

## Darstellung
- **Farbe nach Kategorie** (Tier / Pflanze / Landschaft), abgestimmt aufs naturnahe Theme.
- **Konfidenz** dezent angedeutet (z. B. niedrig = blasser/gestrichelt).
- **Höhepunkt-Phasen** hervorgehoben (z. B. Stern/kräftiger Rand).
- Klick auf Balken/Karte → **Motiv-Detailansicht**.

## Filter
- **Status:** Aktiv jetzt / Bevorstehend / Alle
- **Konfidenz:** alle / mind. mittel / nur hoch
- **Höhepunkt:** nur Höhepunkte an/aus
- **Kategorie:** Tier / Pflanze / Landschaft
- **Tags** (Mehrfachauswahl)
- **Textsuche** (Motivname)

## Definitionen
- **Aktiv jetzt:** eine Phase deckt die aktuelle KW ab (inkl. Jahresübergang-Phasen).
- **Bevorstehend:** eine Phase beginnt innerhalb der nächsten **4 Wochen**.
- **Aktuelle KW:** abgeleitet aus dem Systemdatum des Geräts.

## Out of Scope
- Anlegen/Bearbeiten von Phasen → **PROJ-2** (hier nur Anzeige/Filter)
- Echte Kalenderdaten/Termine, Erinnerungen/Benachrichtigungen
- Fotospot-Verknüpfung in der Kalenderansicht → **PROJ-5**
- Export der Kalenderansicht (Bild/PDF)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen es gibt Motive mit Phasen in der aktuellen KW, wenn ich die Wochenansicht öffne, dann werden genau diese Motive als aktiv angezeigt.
- [ ] Angenommen ich bin in der Wochenansicht, wenn ich eine KW vor-/zurückblättere, dann aktualisiert sich die Liste der aktiven Motive entsprechend.
- [ ] Angenommen eine Phase beginnt innerhalb der nächsten 4 Wochen, wenn ich die Wochenansicht öffne, dann erscheint sie im Block „Bevorstehend".
- [ ] Angenommen ich wechsle zur Jahres-Timeline, wenn Motive Phasen haben, dann sehe ich pro Motiv Balken über die jeweiligen Zeitfenster mit Monatsbeschriftung.
- [ ] Angenommen ich bin in der Jahres-Timeline, wenn ich sie öffne, dann ist die aktuelle KW deutlich markiert.
- [ ] Angenommen eine Phase läuft über den Jahreswechsel (Start-KW > End-KW), wenn sie dargestellt wird, dann wird sie korrekt umlaufend (Dez→Jan) gezeichnet.
- [ ] Angenommen ich setze einen Filter (z. B. nur Höhepunkte / nur hohe Konfidenz / Kategorie Tier), wenn er aktiv ist, dann zeigen beide Ansichten nur passende Einträge.
- [ ] Angenommen ich klicke auf einen Eintrag/Balken, wenn er ein Motiv repräsentiert, dann gelange ich zur Motiv-Detailansicht.
- [ ] Angenommen kein Motiv erfüllt die aktuellen Filter, wenn die Ansicht gerendert wird, dann sehe ich eine klare „Keine Treffer"-Meldung.
- [ ] Angenommen es existieren noch keine Motive/Phasen, wenn ich den Kalender öffne, dann sehe ich einen Leerzustand mit Hinweis, zuerst Motive und Phasen anzulegen.

## Edge Cases
- **Keine Motive/Phasen:** Leerzustand mit Verweis auf PROJ-1/PROJ-2.
- **Filter ohne Treffer:** „Keine Treffer"-Meldung statt leerer Fläche.
- **Jahresübergangs-Phasen:** in beiden Ansichten korrekt (Woche: als aktiv; Timeline: umlaufend).
- **Sehr viele Motive:** Timeline scrollt vertikal; Performance bleibt flüssig.
- **KW 53:** Jahre ohne KW 53 — Anzeige bleibt robust.
- **Phase ohne Bezeichnung:** wird als „aktive Zeit" dargestellt.

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Aktuelle KW aus Systemdatum; KW→Monat-Zuordnung als Anzeige-Hilfe
- Flüssiges Rendern auch bei vielen Motiven (Timeline scrollbar)

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| „Relevanz"-Filter gestrichen | „Gute Zeit jetzt" = Status (Aktiv/Bevorstehend) + Konfidenz; kein eigenes Feld nötig | 2026-06-09 |
| „Höhepunkt"-Filter statt Relevanz | Gezielte Hervorhebung der besten Phasen (PROJ-2-Häkchen) | 2026-06-09 |
| Bevorstehend = nächste 4 Wochen | Guter Planungsvorlauf für Wochenende/Monat | 2026-06-09 |
| Farbe nach Kategorie | Schneller visueller Bezug; Konfidenz/Höhepunkt als Zusatzsignal | 2026-06-09 |
| Zwei umschaltbare Ansichten | Woche = kurzfristig, Timeline = langfristig | 2026-06-09 |
| Aktuelle KW aus Systemdatum | Kein manuelles Setzen nötig | 2026-06-09 |

### Technical Decisions
<!-- Added by /architecture -->
| Decision | Rationale | Date |
|----------|-----------|------|
| Eigene Seite `/kalender`, in der Navigation aktiviert | Erster motivübergreifender Bereich; liest Motive + Saisonphasen | 2026-06-09 |
| Liest `useMotive` + `useSaisonphasen` (je eine Instanz auf der Seite) | Wiederverwendung der Speicher-Schicht; keine Duplikate | 2026-06-09 |
| Reine Berechnungs-Helfer in `src/lib/saison.ts` (unit-getestet) | Aktiv/Bevorstehend/Filter testbar isoliert; zyklische KW-Logik | 2026-06-09 |
| Aktuelle KW via ISO-Wochen-Helfer aus Systemdatum | Kein manuelles Setzen; deckt Jahreswechsel ab | 2026-06-09 |
| Timeline mit CSS-Grid (53 Spalten); Wrap-Phasen in zwei Segmente | Robuste, performante Darstellung ohne Grafikbibliothek | 2026-06-09 |
| Keine neuen Pakete | shadcn/ui + bestehende Hooks reichen | 2026-06-09 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
Seite „Kalender" (/kalender) — NEU, in Navigation aktiviert
├── Kopfzeile: Titel + Ansicht-Umschalter (Tabs: Woche | Jahres-Timeline)
├── Filterleiste (wirkt auf beide Ansichten):
│   Textsuche · Status (Aktiv/Bevorstehend/Alle) · Konfidenz (alle/≥mittel/hoch)
│   · Höhepunkt-Schalter · Kategorie · Tags
├── Wochenansicht
│   ├── KW-Navigator (‹ KW n › + „Heute")
│   ├── „Aktiv in KW n" — Karten der Motive mit aktiver Phase
│   └── „Bevorstehend (nächste 4 Wochen)" — Block
└── Jahres-Timeline
    ├── Monats-/KW-Kopf + Heute-Markierung (senkrechte Linie)
    └── pro Motiv eine Zeile, Phasen als farbige Balken
        (Farbe nach Kategorie · Höhepunkt-Stern · niedrige Konfidenz blasser)

Klick auf Motiv-Karte/Balken → /motive/[id]
Leerzustand: Verweis auf Motive/Saisonphasen anlegen
```

### B) Datenmodell
```
Kein neues Datenmodell — der Kalender ist eine reine Sicht.
Liest: Motive (PROJ-1) + Saisonphasen (PROJ-2) aus localStorage.

Abgeleitete Begriffe (berechnet, nicht gespeichert):
- aktuelle KW = ISO-Woche des heutigen Systemdatums
- „aktiv in KW w" = eine Phase deckt w ab (zyklisch, inkl. Jahresübergang)
- „bevorstehend" = Phasenbeginn 1–4 Wochen nach der aktuellen KW
```

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| Reine Sicht, kein neues Modell | Visualisiert vorhandene Daten |
| Helfer in `lib/saison.ts` (unit-getestet) | Zyklische KW-Logik isoliert testbar |
| CSS-Grid-Timeline (53 Spalten) | Kein Grafik-Paket; performant |
| Eine Hook-Instanz je Collection auf der Seite | Vermeidet Desync (wie in PROJ-2) |

### D) Abhängigkeiten
**Keine neuen Pakete.** shadcn/ui (tabs, select, switch, badge, button, input, card), `useMotive`, `useSaisonphasen`, KW-Helfer aus PROJ-2.

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu:
- **Seite `/kalender`** (`src/app/kalender/page.tsx`); Navigationspunkt „Kalender" aktiviert.
- **Berechnungs-Helfer (unit-getestet):** `src/lib/saison.ts` (`isActiveInKW`, `weeksUntilStart`, `isUpcoming`), `getCurrentKW` in `src/lib/kw.ts`, Filter-Logik in `src/lib/kalender.ts` (`motivPasses`, `phasePassesQuality`).
- **Komponenten** in `src/components/kalender/`: `kalender-filter-bar.tsx` (Suche, Status, Konfidenz, Kategorie, Höhepunkt-Switch, Tag-Chips), `wochen-ansicht.tsx` (KW-Navigator, Aktiv-/Bevorstehend-Blöcke), `jahres-timeline.tsx` (CSS-/Prozent-basierte Balken, Monats-Kopf, Heute-Markierung, Jahresübergang als 2 Segmente).
- Kategorie-Balkenfarben (`barClass`) zu `src/lib/kategorie.ts` ergänzt.

Hinweise:
- Reine Sicht — kein neues Datenmodell; liest Motive + Saisonphasen (je eine Hook-Instanz).
- Status-Filter wirkt phasenweise relativ zur aktuellen KW; gilt für beide Ansichten.

## QA Test Results

**Tested:** 2026-06-09 · **Tester:** QA Engineer (AI) · **Methode:** Code-Review + Unit (Vitest) + E2E (Playwright via System-Edge).

### Acceptance Criteria Status
- [x] Wochenansicht zeigt in der aktuellen KW aktive Motive
- [x] KW vor/zurück blättern + „Heute"
- [x] „Bevorstehend" (nächste 4 Wochen) als eigener Block
- [x] Jahres-Timeline: Balken je Motiv mit Monats-Kopf
- [x] Aktuelle KW markiert (senkrechte Linie)
- [x] Jahresübergang (Start > End) wird umlaufend als zwei Segmente gezeichnet
- [x] Filter (Status, Konfidenz, Höhepunkt, Kategorie, Tags, Text) wirken auf beide Ansichten
- [x] Klick auf Motiv/Balken → Detailseite
- [x] „Keine Treffer" bei leerem Filterergebnis (Timeline)
- [x] Leerzustand ohne Motive/Phasen (Verweis auf Motive)

### Edge Cases Status
- [x] Keine Motive/Phasen → Hinweis
- [x] Jahresübergangs-Phase korrekt (Woche aktiv; Timeline umlaufend)
- [x] Höhepunkt hervorgehoben (Stern/Ring); niedrige Konfidenz blasser
- [x] Viele Motive → Timeline horizontal scrollbar

### Security Audit Results
- [x] Kein Backend/Auth; reine Sicht über lokale Daten
- [x] React-escaped; keine neuen Eingaben/URLs
- [x] Keine Secrets

### Bugs Found
Keine.

### Summary
- **Acceptance Criteria:** alle erfüllt
- **Bugs:** 0
- **Unit Tests:** 42/42 grün (inkl. `saison`, `kalender`)
- **E2E Tests:** 25/25 grün (12 PROJ-1 + 7 PROJ-2 + 6 PROJ-3; via System-Edge) — keine Regressionen
- **Security:** Pass
- **Production Ready:** YES
- **Recommendation:** Deploy-fähig.

## Deployment
_To be added by /deploy_
