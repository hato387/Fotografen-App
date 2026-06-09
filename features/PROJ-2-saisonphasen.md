# PROJ-2: Saisonphasen

## Status: Planned
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

## Dependencies
- **PROJ-1** (Motive-Datenbank) — jede Phase gehört zu genau einem Motiv

## User Stories
- Als Naturfotograf möchte ich einem Motiv eine oder mehrere Saisonphasen zuordnen, damit ich weiß, *wann* ich es fotografieren kann.
- Als Naturfotograf möchte ich pro Phase ein Zeitfenster (Start-/End-KW) festlegen, damit ich es später im Kalender sehe.
- Als Naturfotograf möchte ich jeder Phase eine Bezeichnung, Region, Konfidenz und Notiz geben, damit ich Kontext und Verlässlichkeit festhalte.
- Als Naturfotograf möchte ich Phasen direkt in der Motiv-Detailansicht anlegen/bearbeiten/löschen, damit Wissen und Zeitfenster an einem Ort liegen.

## Datenmodell (eine Saisonphase)
- **Motiv** (Pflicht, Verknüpfung zu PROJ-1)
- **Bezeichnung** (optional, Freitext): z. B. „Balz", „Blüte", „Herbstfärbung"
- **Start-KW** (Pflicht, 1–53)
- **End-KW** (Pflicht, 1–53)
- **Region** (optional, Freitext): z. B. „Süddeutschland", „bundesweit"
- **Konfidenz** (Pflicht, Standard „mittel"): niedrig / mittel / hoch
- **Höhepunkt** (optional, Ja/Nein, Standard Nein): markiert die beste Zeit (z. B. Brutzeit). Dient als Kalender-Filter in PROJ-3.
- **Notiz** (optional, Freitext)

**Zeitlogik:** Kalenderwochen sind **zyklisch, ohne Jahr** (nach KW 52/53 folgt KW 1). Start-KW > End-KW ⇒ Phase läuft über den Jahreswechsel (z. B. KW 48 → KW 6).

## Verwaltung & Anzeige
- Phasen werden in der **Motiv-Detailansicht** in einem Abschnitt „Saisonphasen" verwaltet (Liste + Hinzufügen/Bearbeiten/Löschen).
- Bei der KW-Eingabe/Anzeige wird zur Orientierung der **zugehörige Monat** dargestellt (z. B. „KW 14 ≈ April").
- Mehrere (auch überlappende) Phasen pro Motiv erlaubt.

## Out of Scope
- Motivübergreifende Kalender-/Timeline-Ansicht und Filter → **PROJ-3**
- KI-gestütztes Befüllen von Saisonphasen → **PROJ-8**
- „Relevanz"-Bewertung eines Motivs (Kalender-Filter) → klären in **PROJ-3**
- Automatische Jahres-/Datumsberechnung mit echten Kalenderdaten (wir bleiben bei KW)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich bin in der Motiv-Detailansicht, wenn ich „Saisonphase hinzufügen" wähle, Start-KW + End-KW + Konfidenz angebe und speichere, dann erscheint die Phase in der Phasenliste des Motivs.
- [ ] Angenommen ich lege eine Phase an, wenn ich Start-KW oder End-KW leer lasse, dann wird das Speichern verhindert und eine Validierungsmeldung angezeigt.
- [ ] Angenommen ich gebe eine KW außerhalb 1–53 ein, wenn ich speichere, dann wird die Eingabe abgelehnt und ein Hinweis auf den gültigen Bereich angezeigt.
- [ ] Angenommen Start-KW ist größer als End-KW, wenn ich speichere, dann wird die Phase als Jahresübergang akzeptiert (kein Fehler).
- [ ] Angenommen ich gebe keine Konfidenz an, wenn ich eine Phase anlege, dann ist „mittel" vorausgewählt.
- [ ] Angenommen ich markiere eine Phase als „Höhepunkt", wenn ich sie speichere, dann ist diese Markierung gespeichert und später im Kalender (PROJ-3) filterbar.
- [ ] Angenommen eine Phase existiert, wenn ich sie bearbeite und speichere, dann werden die Änderungen in der Phasenliste angezeigt.
- [ ] Angenommen eine Phase existiert, wenn ich auf „Löschen" klicke, dann muss ich kurz bestätigen, bevor sie entfernt wird.
- [ ] Angenommen ich gebe bei der KW-Eingabe eine Woche ein, wenn das Feld angezeigt wird, dann sehe ich den zugehörigen Monat zur Orientierung.
- [ ] Angenommen ein Motiv hat noch keine Phasen, wenn ich die Detailansicht öffne, dann sehe ich einen Leerzustand mit „Saisonphase hinzufügen".

## Edge Cases
- **Einzelne Woche:** Start = End erlaubt (Phase von genau einer KW).
- **Jahresübergang:** Start > End wird als zyklische Phase über Dez→Jan interpretiert.
- **Überlappende Phasen:** erlaubt; höchstens dezenter Hinweis, kein Block.
- **KW 53:** zulässig (nicht jedes Jahr hat sie) — wird locker behandelt.
- **Motiv ohne Phasen:** Leerzustand statt leerer Abschnitt.
- **Motiv gelöscht (PROJ-1):** zugehörige Phasen werden mitgelöscht (siehe PROJ-1-Löschregel).

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- KW→Monat-Zuordnung als Anzeige-Hilfe (Näherung, da KW jahresabhängig leicht variiert)

## Open Questions
- [x] „Relevanz" geklärt (2026-06-09): Kein eigenes Feld. „Ist jetzt eine gute Zeit?" wird im Kalender (PROJ-3) aus Status (Aktiv/Bevorstehend) + Konfidenz abgeleitet. Zusätzlich markiert das neue **Höhepunkt**-Häkchen die besten Phasen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Zeitfenster als Start-/End-KW, zyklisch ohne Jahr | Einfach, kalendertauglich, jahresunabhängig pflegbar | 2026-06-09 |
| Monat zur Orientierung neben KW anzeigen | KW allein ist schwer im Kopf zu verorten | 2026-06-09 |
| Konfidenz als niedrig/mittel/hoch, Default „mittel" | Ehrlich pflegbar, keine Schein-Genauigkeit durch Prozent | 2026-06-09 |
| Region als Freitext | Flexibler als feste Liste für persönliche Nutzung | 2026-06-09 |
| Überlappende Phasen erlaubt | Reale Biologie überlappt (Balz/Brut); Nutzer nicht gängeln | 2026-06-09 |
| Verwaltung in Motiv-Detailansicht | Wissen + Zeitfenster an einem Ort, klarer Kontext | 2026-06-09 |
| „Relevanz" nicht als Feld; „Höhepunkt"-Häkchen je Phase stattdessen | „Gute Zeit jetzt" ist aus Status+Konfidenz ableitbar; Höhepunkt markiert gezielt Top-Phasen ohne redundantes Relevanz-Feld | 2026-06-09 |

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
