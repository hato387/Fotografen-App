# PROJ-4: Backup/Import

## Status: Planned
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

## Dependencies
- **PROJ-1** (Motive) — Mindestinhalt. Bezieht weitere Datentypen ein, sobald vorhanden: **PROJ-2** (Saisonphasen), **PROJ-5** (Fotospots), **PROJ-6** (Journal), **PROJ-7** (Fotoeinstellungen).

## User Stories
- Als Naturfotograf möchte ich ein Vollbackup meiner gesamten App-Daten als Datei exportieren, damit ich sie sichern und auf ein anderes Gerät übertragen kann.
- Als Naturfotograf möchte ich ein Vollbackup wieder importieren, damit ich meinen kompletten Stand wiederherstellen kann.
- Als Naturfotograf möchte ich ausgewählte Motive als datenschutzbereinigtes Paket exportieren, damit ich Artenwissen teilen kann, ohne private Daten preiszugeben.
- Als Naturfotograf möchte ich ein Motivpaket importieren und es mit meiner Sammlung zusammenführen, damit ich gezielt ergänze.
- Als Naturfotograf möchte ich vor jedem Import eine Vorschau und klare Warnungen sehen, damit ich keine Daten versehentlich verliere.

## Export-Arten
**📦 Vollbackup** (für dich selbst — Sicherung/Geräteumzug)
- Enthält **alle** App-Daten: Motive, Saisonphasen, Fotospots (GPS), Journal, Fotoeinstellungen (sofern vorhanden).
- **Nicht** datenschutzbereinigt.

**🌱 Motivdatenpaket** (zum Teilen / als KI-Importformat für PROJ-8)
- Enthält **ausgewählte Motive** (Mehrfachauswahl) samt Wissen: Beschreibung, Verhalten, Lebensraum, Fototipps, Ethik, Tags, Quellen, **Saisonphasen**.
- **Datenschutzbereinigt:** **keine** GPS-Fotospots, **kein** Journal, **keine** privaten Notizen.

## Import-Verhalten
**Vollbackup importieren = ersetzen**
- Überschreibt alle aktuellen App-Daten (Restore).
- Vorher deutlicher **Warndialog** („ersetzt alle Daten") mit Empfehlung, zuvor selbst zu sichern.

**Motivpaket importieren = hinzufügen/zusammenführen**
- Motive werden zur Sammlung hinzugefügt.
- Bei **Namenskonflikt** pro Motiv: **Überspringen** / **Als Duplikat hinzufügen** / **Bestehendes ersetzen**.

Beide Importe zeigen **vorab eine Vorschau** (z. B. „5 Motive, 12 Saisonphasen") und **danach ein Ergebnis** („3 hinzugefügt, 2 übersprungen").

## Dateiformat & Absicherung
- **JSON** mit Kopfdaten: **Typ** (Vollbackup / Motivpaket), **Format-Version** (z. B. `1`), **Exportdatum**.
- Dateinamen sprechend, z. B. `naturfoto-backup-2026-06-09.json`, `naturfoto-motive-2026-06-09.json`.
- **Import-Prüfung:** ungültige JSON / falscher Typ / unbekannte Version → klare Fehlermeldung, **Abbruch ohne Datenverlust**. Vorschau/Bestätigung erst nach erfolgreicher Prüfung.

## Bedienung
- Eigener Bereich **„Backup & Import"** (Seite/Tab) mit: „Vollbackup exportieren", „Motive exportieren…" (mit Motiv-Auswahl), „Datei importieren".
- Export = Datei-**Download**; Import = Datei-**Upload**. Alles lokal — nichts verlässt das Gerät.

## Out of Scope
- KI-Prompt-Erzeugung (nutzt aber das Motivpaket-Format) → **PROJ-8**
- Automatische/zeitgesteuerte Backups, Cloud-Sync
- Teilen über das Netz (es entsteht nur eine Datei; Versand macht der Nutzer selbst)
- Selektiver Teil-Import einzelner Felder (Import erfolgt motivweise)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich habe Daten in der App, wenn ich „Vollbackup exportieren" wähle, dann wird eine JSON-Datei mit allen Daten und Kopfdaten (Typ, Version, Datum) heruntergeladen.
- [ ] Angenommen ich wähle „Motive exportieren", wenn ich bestimmte Motive auswähle und exportiere, dann enthält die Datei nur deren Wissen + Saisonphasen, **ohne** Spots, Journal und private Notizen.
- [ ] Angenommen ich importiere ein Vollbackup, wenn ich bestätige, dann werden alle aktuellen Daten durch den Backup-Inhalt ersetzt — nach vorheriger Warnung.
- [ ] Angenommen ich importiere ein Motivpaket, wenn kein Namenskonflikt besteht, dann werden die Motive zur Sammlung hinzugefügt.
- [ ] Angenommen ein importiertes Motiv hat denselben Namen wie ein bestehendes, wenn der Konflikt auftritt, dann kann ich Überspringen / Duplikat / Ersetzen wählen.
- [ ] Angenommen ich wähle eine ungültige oder beschädigte Datei, wenn ich importiere, dann erscheint eine Fehlermeldung und meine bestehenden Daten bleiben unverändert.
- [ ] Angenommen die Datei hat eine unbekannte Format-Version, wenn ich importiere, dann wird der Import abgelehnt mit Hinweis auf die Version.
- [ ] Angenommen ich starte einen Import, wenn die Datei gültig ist, dann sehe ich vor dem Anwenden eine Vorschau des Inhalts.
- [ ] Angenommen ein Import ist abgeschlossen, wenn er erfolgreich war, dann sehe ich eine Ergebnismeldung (z. B. „3 hinzugefügt, 2 übersprungen").

## Edge Cases
- **Leere App:** Vollbackup-Export erzeugt eine gültige (leere) Datei; Hinweis, dass nichts zu sichern ist.
- **Sehr große Sammlung:** Export/Import bleibt funktionsfähig (reine Textdaten).
- **Abgebrochener Import:** bestehende Daten bleiben unverändert (kein Teil-Schreiben).
- **Manuell manipulierte Datei:** Schema-Prüfung fängt fehlende/falsche Felder ab.
- **localStorage voll beim Import:** klare Fehlermeldung, kein halber Zustand.
- **Motivpaket ohne Saisonphasen:** zulässig (Motive ohne Phasen importierbar).

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Versioniertes JSON-Schema; Schema-Validierung beim Import
- Atomarer Import (entweder ganz oder gar nicht — kein halber Zustand)

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Zwei Export-Arten (Vollbackup / Motivpaket) | Trennt private Komplettsicherung von teilbarem Artenwissen | 2026-06-09 |
| Datenschutzbereinigt = ohne Spots/Journal/Notizen | Nur allgemeingültiges Wissen wird geteilt | 2026-06-09 |
| Vollbackup = ersetzen, Motivpaket = zusammenführen | Snapshot-Restore vs. gezieltes Ergänzen | 2026-06-09 |
| Namenskonflikt: Überspringen/Duplikat/Ersetzen | Volle Kontrolle beim Zusammenführen | 2026-06-09 |
| Versioniertes JSON + harte Importprüfung | Zukunftssicher; kein Datenverlust bei Fehlern | 2026-06-09 |
| Motivpaket-Format = KI-Importformat (PROJ-8) | Eine Quelle der Wahrheit für Import | 2026-06-09 |

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
