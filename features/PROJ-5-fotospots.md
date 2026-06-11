# PROJ-5: Fotospots

## Status: Approved
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
| Eigene Collection `naturfoto:fotospots`; Navigation aktiviert | Wiederverwendung der Speicher-Schicht | 2026-06-09 |
| Übersicht + Detailroute `/fotospots/[id]` + Formular-Dialog (wie Motive) | Konsistente UX, Deep-Links | 2026-06-09 |
| Verknüpfte Motive als IDs (`motivIds`) | Lose Kopplung; Motiv-Löschen entfernt Verknüpfung beim Anzeigen | 2026-06-09 |
| Geo-Helfer in `src/lib/geo.ts` (Validierung + externer Karten-Link) | Keine Karten-Bibliothek; testbar | 2026-06-09 |
| Motiv-Mehrfachauswahl via Popover + Command | Suchbare Auswahl, skaliert mit vielen Motiven | 2026-06-09 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
Seite „Fotospots" (/fotospots) — NEU, Navigation aktiviert
├── Kopf: Titel + „Neuer Fotospot"
├── Textsuche
├── Karten-Raster: Name · Beobachtungs-Auszug · verknüpfte Motive · Tags · „Karte öffnen"
└── Leerzustand

Seite „Fotospot-Detail" (/fotospots/[id])
├── Name + „Auf Karte öffnen" (falls Koordinaten)
├── Verknüpfte Motive (Chips → /motive/[id])
├── Beobachtungen & Ideen · Beste Zeit
└── Bearbeiten / Löschen

Fotospot-Formular (Dialog, Anlegen & Bearbeiten):
Name* · lat/lng (optional) · Motiv-Mehrfachauswahl · Beobachtungen
· Beste Zeit · Tags · Bild-Link
```

### B) Datenmodell (ein Fotospot)
```
- id, name (Pflicht)
- lat?, lng?  (optional; validiert -90..90 / -180..180)
- motivIds: string[]  (verknüpfte Motive)
- beobachtungen?  (Freitext)
- besteZeit?      (Freitext)
- tags: string[]
- bildUrl?        (nur http(s))
- erstelltAm / geaendertAm

Gespeichert in: localStorage "naturfoto:fotospots".
NICHT Teil geteilter Motivpakete (Datenschutz).
```

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| Eigene Collection + Detailroute | Konsistenz mit Motive; Deep-Links |
| `motivIds`-Verknüpfung | Lose Kopplung; robust bei Motiv-Löschung |
| Geo-Helfer (Validierung + Karten-Link) | Lokal, keine Karten-Lib |
| Popover+Command Mehrfachauswahl | Suchbar, skaliert |

### D) Abhängigkeiten
**Keine neuen Pakete.** shadcn/ui (command, popover, checkbox, dialog, input, textarea, badge, button) + bestehende Hooks.

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu: Collection `naturfoto:fotospots` + `Fotospot`-Typ; `useFotospots`; `src/lib/geo.ts` (Validierung lat/lng, `parseCoord` mit Komma-Toleranz, OSM-`mapUrl`); Komponenten `src/components/fotospots/` (Formular-Dialog mit Koordinaten-Validierung & Bild-URL-Härtung, `MotivMultiSelect` via Popover+Command, Karte); ausgelagerter `src/components/tag-input.tsx`; Seiten `/fotospots` (Übersicht) + `/fotospots/[id]` (Detail mit Karten-Link & Motiv-Chips). Navigationspunkt aktiviert.

**Nachbesserungen (2026-06-11):** (1) Bild-Link wird jetzt auf der Spot-Detailseite angezeigt (war erfasst, aber nie gerendert — Mängelliste #2). (2) Motiv-Detailseite zeigt „Fotospots mit diesem Motiv" (Rückrichtung, #4). (3) Motiv-Löschen bereinigt `motivIds` in Fotospots und zählt betroffene Spots in der Lösch-Warnung (#5).

## QA Test Results

**Tested:** 2026-06-09 · **Tester:** QA Engineer (AI) · **Methode:** Code-Review + Unit (Vitest) + E2E (Playwright via System-Edge).

### Acceptance Criteria Status
- [x] Fotospot mit nur Namen anlegen (GPS optional)
- [x] Name-Pflicht (Validierung)
- [x] Ungültige Koordinaten abgelehnt (Bereich −90…90 / −180…180; Komma toleriert)
- [x] „Auf Karte öffnen" bei vorhandenen Koordinaten (externer OSM-Link)
- [x] Kein Karten-Link ohne Koordinaten
- [x] Verknüpfte Motive (Mehrfachauswahl) → anklickbar auf Detailseite
- [x] Beobachtungen/Ideen-Freitext bleibt erhalten
- [x] Löschen mit Bestätigung
- [x] Textsuche (Name/Beobachtungen/Tags) + Leerzustand

### Security Audit Results
- [x] Lokal, kein Backend; Fotospots nie in geteilten Motivpaketen (PROJ-4)
- [x] Bild-URL auf http(s) beschränkt; Texte React-escaped
- [x] Externer Karten-Link mit `rel=noopener`

### Bugs Found
Keine. (Test-Bug bei Selektor-Mehrdeutigkeit während der Erstellung behoben.)

### Summary
- **Acceptance Criteria:** alle erfüllt · **Bugs:** 0
- **Unit Tests:** 61/61 grün (inkl. `geo`)
- **E2E Tests:** 36/36 grün (inkl. 7 PROJ-5) via System-Edge — keine Regressionen
- **Security:** Pass · **Production Ready:** YES

## Deployment
_To be added by /deploy_
