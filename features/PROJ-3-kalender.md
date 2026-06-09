# PROJ-3: Kalender

## Status: Planned
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
- Fotospots/Journal-Verknüpfung in der Kalenderansicht → **PROJ-5/6**
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

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
