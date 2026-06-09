# PROJ-5: Fotospots

## Status: Planned
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

## Dependencies
- Keine (eigenständig). Wird von **PROJ-6** (Journal) referenziert.

## User Stories
- Als Naturfotograf möchte ich Fotospots mit Name und GPS-Koordinaten anlegen, damit ich gute Orte wiederfinde.
- Als Naturfotograf möchte ich Notizen und Tags pro Spot hinterlegen, damit ich Zugang, beste Zeit usw. festhalte.
- Als Naturfotograf möchte ich einen Spot auf einer externen Karte öffnen, damit ich ihn navigieren kann.
- Als Naturfotograf möchte ich Spots durchsuchen, bearbeiten und löschen, damit meine Ortssammlung sauber bleibt.

## Datenmodell (ein Fotospot)
- **Name** (Pflicht)
- **GPS-Koordinaten** (Pflicht): Breitengrad (lat) / Längengrad (lng)
- **Notizen** (optional, Freitext): Zugang, Parken, beste Tageszeit, Ausrichtung …
- **Tags** (optional, mehrere freie Schlagwörter)

## Koordinaten & Karte
- **Manuelle Eingabe** von lat/lng (z. B. aus Handy/Maps kopiert).
- **„Auf Karte öffnen"-Link** zeigt die Koordinaten in externer Karte (OpenStreetMap/Google Maps) — keine eingebettete Karten-Bibliothek.
- **Validierung:** lat −90…90, lng −180…180; ungültige Werte werden beim Speichern abgelehnt.

## Übersicht
- Liste/Karten mit Name, Notizen-Auszug, Tags, „Auf Karte öffnen"-Link.
- **Textsuche** über Name/Notizen/Tags.

## Löschen
- Bestätigungsdialog. **Warnung**, wenn verknüpfte Journal-Einträge (PROJ-6) existieren.
- Beim Löschen: **Journal-Einträge bleiben erhalten**, verlieren nur die Spot-Verknüpfung.

## Out of Scope
- Eingebettete, anklickbare Karte / Pin-Setzen (spätere Erweiterung — bräuchte Karten-Bibliothek)
- Routenplanung/Navigation in der App
- Verknüpfung Spot↔Motiv direkt (Verknüpfung läuft über das Journal → **PROJ-6**)
- Spots in geteilten Motivpaketen (bewusst ausgeschlossen, „datenschutzbereinigt" → **PROJ-4**)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich bin in der Spot-Übersicht, wenn ich „Neuer Fotospot" wähle, Name + gültige Koordinaten eingebe und speichere, dann erscheint der Spot in der Übersicht.
- [ ] Angenommen ich lege einen Spot an, wenn Name oder Koordinaten fehlen, dann wird das Speichern verhindert und eine Validierungsmeldung pro Pflichtfeld angezeigt.
- [ ] Angenommen ich gebe Koordinaten außerhalb des gültigen Bereichs ein, wenn ich speichere, dann wird die Eingabe abgelehnt mit Hinweis auf den gültigen Bereich.
- [ ] Angenommen ein Spot existiert, wenn ich „Auf Karte öffnen" wähle, dann öffnet sich eine externe Karte an diesen Koordinaten.
- [ ] Angenommen ein Spot existiert, wenn ich ihn bearbeite und speichere, dann werden die Änderungen übernommen.
- [ ] Angenommen ein Spot existiert, wenn ich auf „Löschen" klicke, dann erscheint ein Bestätigungsdialog.
- [ ] Angenommen verknüpfte Journal-Einträge existieren, wenn ich einen Spot lösche, dann warnt der Dialog, und die Einträge bleiben danach ohne Spot-Verknüpfung erhalten.
- [ ] Angenommen ich gebe einen Suchbegriff ein, wenn er auf Name/Notizen/Tags passt, dann zeigt die Übersicht nur passende Spots.
- [ ] Angenommen noch kein Spot existiert, wenn ich die Übersicht öffne, dann sehe ich einen Leerzustand mit „Ersten Fotospot anlegen".

## Edge Cases
- **Ungültige/leere Koordinaten:** abgelehnt mit Hinweis.
- **Koordinaten mit Komma statt Punkt:** tolerant einlesen oder klarer Hinweis.
- **Sehr viele Spots:** Liste bleibt durchsuchbar/performant.
- **Spot ohne Notizen/Tags:** zulässig (nur Name + Koordinaten).
- **Suche ohne Treffer:** „Keine Treffer"-Meldung.
- **localStorage voll:** Fehlermeldung, Eingabe bleibt erhalten.

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Koordinaten-Validierung (lat/lng-Bereiche)
- Externer Karten-Link (OpenStreetMap/Google Maps), kein eingebettetes Karten-SDK

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Manuelle lat/lng + externer Karten-Link | Vollständig lokal, keine Karten-Bibliothek nötig | 2026-06-09 |
| Ein Freitext-Notizfeld statt vieler Einzelfelder | Flexibel; Nutzer strukturiert selbst | 2026-06-09 |
| Löschen entfernt nur Journal-Verknüpfung | Beobachtungen bleiben erhalten, auch ohne Ort | 2026-06-09 |
| Spots nie in geteilten Paketen | Datenschutz (Standorte sind sensibel) | 2026-06-09 |

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
