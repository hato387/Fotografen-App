# PROJ-8: KI-Motiv-Prompt-Generator & Import

## Status: Planned
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

> Motivname → strukturierter Prompt für eine beliebige KI → KI liefert Motivdaten **+ Saisonphasen** als JSON → Rück-Import in die App.

## Dependencies
- **PROJ-1** (Motive) und **PROJ-2** (Saisonphasen) — Zielschema der KI-Ausgabe
- **PROJ-4** (Backup/Import) — wiederverwendete Importlogik & Motivpaket-Format

## User Stories
- Als Naturfotograf möchte ich einen Motivnamen eingeben und einen fertigen KI-Prompt erhalten, damit ich ein Motiv fachlich befüllen lassen kann.
- Als Naturfotograf möchte ich Kategorie und Region als Hinweise mitgeben, damit die KI passende Einordnung und Saisonphasen liefert.
- Als Naturfotograf möchte ich den Prompt mit einem Klick kopieren, damit ich ihn in eine beliebige KI einfügen kann.
- Als Naturfotograf möchte ich die KI-Antwort einfügen und importieren, damit das Motiv samt Saisonphasen in meiner App landet.
- Als Naturfotograf möchte ich vor dem Import eine Vorschau und Konfliktbehandlung sehen, damit ich nichts versehentlich überschreibe.

## Ablauf
1. **Eingabe:** Motivname (Pflicht), Kategorie (optional: Tier/Pflanze/Landschaft), Region (optional).
2. **Prompt erzeugen:** App baut einen strukturierten Prompt mit Kopier-Button.
3. **Extern:** Nutzer fügt den Prompt in eine KI ein, kopiert die Antwort.
4. **Einfügen & Importieren:** Antwort ins Einfügefeld → „Importieren".
5. **Ergebnis:** Vorschau → Bestätigung → Ergebnismeldung + Link zum Motiv.

## Der erzeugte Prompt
Weist die KI an,
- alle **Motiv-Textfelder** zu füllen: Beschreibung, Verhalten, Lebensraum, Fototipps, **Ethikhinweise**, Tags, **Quellen** (Nutzer prüft nach),
- passende **Saisonphasen** zu liefern: Start-/End-KW, Region, Konfidenz (niedrig/mittel/hoch), ggf. **Höhepunkt**,
- die übergebene **Kategorie/Region** zu berücksichtigen,
- **ausschließlich gültiges JSON** im erwarteten Motivpaket-Format auszugeben (kein Fließtext drumherum).

## Import der KI-Antwort
- Nutzt die **PROJ-4-Importlogik** (Motivpaket): Schema-Validierung, **Vorschau**, Namenskonflikt → **Überspringen / Duplikat / Ersetzen**.
- **Tolerant gegenüber Beifang:** JSON-Block wird, falls nötig, automatisch aus der Antwort herausgelöst.
- Schlägt das Parsen fehl → klare Fehlermeldung „Keine gültigen Motivdaten erkannt", **kein** Datenverlust.
- Erfolg → Ergebnismeldung („Motiv ‚Eisvogel' mit 3 Saisonphasen importiert") + Link zum Motiv.

## Out of Scope
- **Direkte KI-Anbindung/API** (die App ruft keine KI auf — sie erzeugt nur den Prompt; Nutzer nutzt eine beliebige KI selbst)
- Mehrere Motive in einem Durchlauf (ein Motiv pro Prompt)
- Befüllen von Fotospots/Fotoeinstellungen per KI (nur Motiv + Saisonphasen)
- Automatische Qualitäts-/Faktenprüfung der KI-Ausgabe (Nutzer prüft selbst, v. a. Quellen)

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen ich gebe einen Motivnamen ein, wenn ich „Prompt erzeugen" wähle, dann zeigt die App einen strukturierten Prompt mit Kopier-Button.
- [ ] Angenommen ich gebe Kategorie und/oder Region an, wenn der Prompt erzeugt wird, dann sind diese Hinweise im Prompt enthalten.
- [ ] Angenommen ich lasse den Motivnamen leer, wenn ich „Prompt erzeugen" wähle, dann wird dies verhindert und eine Validierungsmeldung angezeigt.
- [ ] Angenommen ein Prompt ist erzeugt, wenn ich „Kopieren" klicke, dann liegt der Prompt in der Zwischenablage.
- [ ] Angenommen ich füge eine gültige KI-Antwort ein, wenn ich „Importieren" wähle, dann sehe ich eine Vorschau der erkannten Motivdaten und Saisonphasen.
- [ ] Angenommen die KI-Antwort enthält Text um das JSON herum, wenn ich importiere, dann wird der JSON-Block automatisch herausgelöst und verarbeitet.
- [ ] Angenommen die Antwort enthält kein gültiges JSON, wenn ich importiere, dann erscheint „Keine gültigen Motivdaten erkannt" und nichts wird geändert.
- [ ] Angenommen ein Motiv gleichen Namens existiert, wenn ich importiere, dann kann ich Überspringen / Duplikat / Ersetzen wählen.
- [ ] Angenommen der Import war erfolgreich, wenn er abgeschlossen ist, dann sehe ich eine Ergebnismeldung und einen Link zum Motiv.

## Edge Cases
- **Beifang-Text um JSON:** automatisch herauslösen; bei Mehrdeutigkeit Fehlermeldung.
- **Unvollständige KI-Daten:** fehlende optionale Felder bleiben leer; nur Pflicht (Name, Kategorie) muss valide sein.
- **Ungültige KW in Saisonphasen:** wird wie in PROJ-2 abgelehnt/markiert; Rest importierbar.
- **Sehr lange KI-Antwort:** Einfügefeld bleibt nutzbar; Verarbeitung robust.
- **Namenskonflikt:** PROJ-4-Konfliktbehandlung.
- **Leere Zwischenablage / nichts eingefügt:** Hinweis statt Fehler.

## Technical Requirements (optional)
- Persistenz: localStorage (kein Backend)
- Keine externe KI-API — reine Prompt-Erzeugung + clientseitiges JSON-Parsing
- JSON-Extraktion tolerant gegenüber umgebendem Text

## Open Questions
- [ ] Keine offenen Fragen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| App ruft keine KI auf, erzeugt nur den Prompt | KI-neutral, kein API-Key/Kosten, volle Nutzerkontrolle | 2026-06-09 |
| Ein Motiv pro Prompt | Überschaubar, bessere Qualität, klarer Import | 2026-06-09 |
| Kategorie + Region als optionale Hinweise | Bessere Einordnung und regionsgerechte Saisonphasen | 2026-06-09 |
| Quellen mitliefern lassen | Nützlich, Nutzer prüft Richtigkeit selbst | 2026-06-09 |
| Import über PROJ-4-Logik | Eine Quelle der Wahrheit; Vorschau + Konfliktbehandlung | 2026-06-09 |
| JSON-Beifang automatisch herauslösen | KIs liefern oft Text drumherum; reibungsloser Import | 2026-06-09 |

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
