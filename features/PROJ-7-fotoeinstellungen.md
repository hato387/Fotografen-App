# PROJ-7: Fotoeinstellungen

## Status: Planned
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

> **Eigenständige Sammlung** von Kamera-Einstellungs-Rezepten mit selbst vergebenen Namen (z. B. „Vogel im Flug", „Nebellandschaft"). **Nicht** an Motive gekoppelt.

## Dependencies
- Keine (eigenständig)

## User Stories
- Als Naturfotograf möchte ich Einstellungs-Rezepte mit eigenem Namen anlegen, damit ich bewährte Kameraeinstellungen wiederfinde.
- Als Naturfotograf möchte ich Blende, Belichtungszeit, ISO und Brennweite festhalten, damit ich sie schnell nachschlagen kann.
- Als Naturfotograf möchte ich Ausrüstung und Notizen ergänzen, damit ich den Kontext nicht vergesse.
- Als Naturfotograf möchte ich meine Rezepte durchsuchen, bearbeiten und löschen, damit die Sammlung gepflegt bleibt.

## Datenmodell (eine Fotoeinstellung)
- **Name** (Pflicht): selbst vergeben, z. B. „Vogel im Flug"
- **Blende** (optional): z. B. f/5.6
- **Belichtungszeit** (optional): z. B. 1/2000 s
- **ISO** (optional): z. B. 800
- **Brennweite** (optional): z. B. 400 mm
- **Ausrüstung** (optional, Freitext): Kamera/Objektiv
- **Notiz** (optional, Freitext): Kontext, Tipps, Lichtsituation, Stativ/Freihand …
- **Tags** (optional, mehrere freie Schlagwörter)

## Übersicht
- Liste/Karten mit Name, Kurzüberblick der Werte (Blende/Zeit/ISO/Brennweite), Tags.
- **Textsuche** über Name / Notiz / Tags.
- Anlegen / Bearbeiten / Löschen (Löschen mit Bestätigung).

## Out of Scope
- Verknüpfung mit Motiven (PROJ-1) — bewusst eigenständig
- Automatische Übernahme aus EXIF-Daten von Fotos
- Aufnahme in geteilte Motivpakete (nicht motivgebunden → nur im Vollbackup)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich bin in der Übersicht, wenn ich „Neue Fotoeinstellung" wähle, einen Namen eingebe und speichere, dann erscheint das Rezept in der Übersicht.
- [ ] Angenommen ich lege ein Rezept an, wenn der Name fehlt, dann wird das Speichern verhindert und eine Validierungsmeldung angezeigt.
- [ ] Angenommen ich lasse alle Kamera-Felder leer, wenn ich nur einen Namen angebe, dann kann ich trotzdem speichern.
- [ ] Angenommen ein Rezept existiert, wenn ich es bearbeite und speichere, dann werden die Änderungen übernommen.
- [ ] Angenommen ein Rezept existiert, wenn ich auf „Löschen" klicke, dann erscheint ein Bestätigungsdialog.
- [ ] Angenommen ich gebe einen Suchbegriff ein, wenn er auf Name/Notiz/Tags passt, dann zeigt die Übersicht nur passende Rezepte.
- [ ] Angenommen noch kein Rezept existiert, wenn ich die Übersicht öffne, dann sehe ich einen Leerzustand mit „Erste Fotoeinstellung anlegen".

## Edge Cases
- **Nur Name, sonst leer:** zulässig.
- **Freitext-Werte:** Felder wie Blende/ISO werden als Text gespeichert (kein starres Zahlenformat erzwungen, da Schreibweisen variieren: „f/5.6", „5.6", „1/2000").
- **Sehr viele Rezepte:** Liste bleibt durchsuchbar/performant.
- **Suche ohne Treffer:** „Keine Treffer"-Meldung.
- **localStorage voll:** Fehlermeldung, Eingabe bleibt erhalten.

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Kamera-Werte als Freitext (keine erzwungene Zahlennormierung)

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Eigenständig, nicht an Motiv gekoppelt | Nutzer benennt Rezepte selbst (situationsbezogen), unabhängig von Arten | 2026-06-09 |
| Nur Name Pflicht, alles andere optional | Schnelles Festhalten, wächst über die Zeit | 2026-06-09 |
| Kamera-Werte als Freitext | Variable Schreibweisen erlauben (f/5.6, 1/2000 …) | 2026-06-09 |
| Extras (Stativ/Licht) im Notizfeld | Kein Feld-Wildwuchs | 2026-06-09 |
| Nicht in geteilten Motivpaketen | Nicht motivgebunden; nur im Vollbackup | 2026-06-09 |

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
