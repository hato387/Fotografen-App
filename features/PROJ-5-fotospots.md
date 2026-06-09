# PROJ-5: Fotospots

## Status: Planned
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

> **Hinweis:** Dieses Feature vereint die ursprünglich getrennten Ideen **Fotospots** und **Journal**. Das frühere PROJ-6 (Journal) wurde bewusst hier eingegliedert, um nicht viele Einzel-Journaleinträge zu erzeugen. Ein Fotospot ist *ein* Ort, an dem GPS, Motiv-Bezug, Beobachtungen/Ideen und Timing gebündelt werden.

## Dependencies
- **PROJ-1** (Motive) — für die optionale Verknüpfung von Motiven zu einem Spot

## User Stories
- Als Naturfotograf möchte ich Fotospots mit Name und (optional) GPS-Koordinaten anlegen, damit ich gute Orte wiederfinde.
- Als Naturfotograf möchte ich an einem Spot meine Beobachtungen und Fotoideen in einem Freitextfeld festhalten, ohne viele Einzeleinträge zu erzeugen.
- Als Naturfotograf möchte ich einem Spot ein oder mehrere Motive zuordnen, damit ich weiß, was ich dort fotografieren kann.
- Als Naturfotograf möchte ich eine spot-eigene „beste Zeit"-Notiz hinterlegen, damit ich das Timing parat habe.
- Als Naturfotograf möchte ich einen Spot mit Koordinaten auf einer externen Karte öffnen, damit ich ihn navigieren kann.
- Als Naturfotograf möchte ich Spots durchsuchen, bearbeiten und löschen, damit meine Sammlung sauber bleibt.

## Datenmodell (ein Fotospot)
- **Name** (Pflicht)
- **GPS-Koordinaten** (optional): Breitengrad (lat) / Längengrad (lng)
- **Verknüpfte Motive** (optional, mehrere): Verknüpfung zu Motiven (PROJ-1); Klick führt zum Motiv (inkl. dessen Saisonphasen)
- **Beobachtungen & Fotoideen** (optional, *ein* Freitextfeld): laufend pflegbar — statt vieler Einzeleinträge
- **Beste Zeit / Zeitraum** (optional, Freitext): z. B. „Mai–Juni, früh morgens" — spot-eigene Timing-Notiz
- **Tags** (optional, mehrere freie Schlagwörter)
- **Bild-Link** (optional, URL zu einem Foto)

## Koordinaten & Karte
- **Manuelle Eingabe** von lat/lng (z. B. aus Handy/Maps kopiert), optional.
- Bei vorhandenen Koordinaten: **„Auf Karte öffnen"-Link** zeigt sie in externer Karte (OpenStreetMap/Google Maps) — keine eingebettete Karten-Bibliothek.
- **Validierung:** falls angegeben, lat −90…90, lng −180…180; ungültige Werte werden beim Speichern abgelehnt.

## Übersicht
- Liste/Karten mit Name, Auszug aus Beobachtungen/Ideen, verknüpfte Motive, Tags und (falls Koordinaten vorhanden) „Auf Karte öffnen".
- **Textsuche** über Name / Beobachtungen / Tags.

## Löschen
- Bestätigungsdialog vor dem Entfernen.
- Verknüpfte Motive werden **nicht** gelöscht (nur die Verknüpfung entfällt).

## Out of Scope
- Eingebettete, anklickbare Karte / Pin-Setzen (spätere Erweiterung — bräuchte Karten-Bibliothek)
- Routenplanung/Navigation in der App
- Separates, dateibasiertes Journal mit vielen Einzeleinträgen (bewusst verworfen — ursprüngliches PROJ-6)
- Fotospots in geteilten Motivpaketen (bewusst ausgeschlossen, „datenschutzbereinigt" → **PROJ-4**)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich bin in der Spot-Übersicht, wenn ich „Neuer Fotospot" wähle, einen Namen eingebe und speichere, dann erscheint der Spot in der Übersicht (auch ohne Koordinaten).
- [ ] Angenommen ich lege einen Spot an, wenn der Name fehlt, dann wird das Speichern verhindert und eine Validierungsmeldung angezeigt.
- [ ] Angenommen ich gebe Koordinaten an, wenn diese außerhalb des gültigen Bereichs liegen, dann wird die Eingabe abgelehnt mit Hinweis auf den gültigen Bereich.
- [ ] Angenommen ein Spot hat Koordinaten, wenn ich „Auf Karte öffnen" wähle, dann öffnet sich eine externe Karte an diesen Koordinaten.
- [ ] Angenommen ein Spot hat keine Koordinaten, wenn ich ihn ansehe, dann wird kein Karten-Link angezeigt (kein Fehler).
- [ ] Angenommen ich bearbeite einen Spot, wenn ich Motive verknüpfe und speichere, dann werden die verknüpften Motive am Spot angezeigt und sind anklickbar.
- [ ] Angenommen ich trage Beobachtungen/Ideen in das Freitextfeld ein, wenn ich speichere, dann bleiben sie am Spot erhalten.
- [ ] Angenommen ein Spot existiert, wenn ich auf „Löschen" klicke, dann erscheint ein Bestätigungsdialog; verknüpfte Motive bleiben danach erhalten.
- [ ] Angenommen ich gebe einen Suchbegriff ein, wenn er auf Name/Beobachtungen/Tags passt, dann zeigt die Übersicht nur passende Spots.
- [ ] Angenommen noch kein Spot existiert, wenn ich die Übersicht öffne, dann sehe ich einen Leerzustand mit „Ersten Fotospot anlegen".

## Edge Cases
- **Spot ohne Koordinaten:** zulässig (nur Name nötig); kein Karten-Link.
- **Ungültige Koordinaten:** abgelehnt mit Hinweis.
- **Koordinaten mit Komma statt Punkt:** tolerant einlesen oder klarer Hinweis.
- **Verknüpftes Motiv gelöscht (PROJ-1):** Verknüpfung am Spot entfällt, Spot bleibt erhalten.
- **Sehr viele Spots:** Liste bleibt durchsuchbar/performant.
- **Suche ohne Treffer:** „Keine Treffer"-Meldung.
- **localStorage voll:** Fehlermeldung, Eingabe bleibt erhalten.

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Koordinaten-Validierung (lat/lng-Bereiche), wenn angegeben
- Externer Karten-Link (OpenStreetMap/Google Maps), kein eingebettetes Karten-SDK

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Journal mit Fotospots zusammengelegt (PROJ-6 entfällt) | Keine Flut von Einzel-Journaleinträgen; ein Ort bündelt alles | 2026-06-09 |
| GPS optional, nur Name Pflicht | Auch reine Ideen-/Beobachtungsnotizen ohne Koordinaten möglich | 2026-06-09 |
| Beobachtungen/Ideen als *ein* Freitextfeld | Bewusst gegen viele Einzeleinträge, kein Aufblähen | 2026-06-09 |
| Verknüpfte Motive optional & mehrfach | Flexibel; muss nicht konsequent genutzt werden | 2026-06-09 |
| Manuelle lat/lng + externer Karten-Link | Vollständig lokal, keine Karten-Bibliothek nötig | 2026-06-09 |
| Fotospots nie in geteilten Paketen | Datenschutz (Standorte/Beobachtungen sind sensibel) | 2026-06-09 |

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
