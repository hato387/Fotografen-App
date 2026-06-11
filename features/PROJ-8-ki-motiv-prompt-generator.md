# PROJ-8: KI-Motiv-Prompt-Generator & Import

## Status: Approved
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
| Reine Logik in `src/lib/ki.ts` (unit-getestet): Prompt-Bau, JSON-Extraktion, Normalisierung | Testbar; KI-Ausgabe robust verarbeiten | 2026-06-09 |
| Import nutzt PROJ-4 `mergeMotivpaket` + Hook-`replaceAll` | Eine Quelle der Wahrheit; Konfliktbehandlung wiederverwendet | 2026-06-09 |
| Toleranter Parser: akzeptiert Envelope, `{motive,saisonphasen}` oder einzelnes Motiv-Objekt; löst JSON aus Beifang | KIs liefern uneinheitlich; maximale Robustheit | 2026-06-09 |
| Sanitizing: Pflicht (Name+Kategorie) erzwingen, KW/Konfidenz prüfen, IDs neu vergeben | Schützt den Bestand vor fehlerhafter KI-Ausgabe | 2026-06-09 |
| Keine KI-API; reine Clipboard-Erzeugung | KI-neutral, kein Key/Kosten | 2026-06-09 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
Seite „KI-Import" (/ki-import) — NEU, Navigation aktiviert
├── Schritt 1: Eingabe (Motivname* · Kategorie? · Region?)
│   └── „Prompt erzeugen" → Prompt-Box mit „Kopieren"
├── Schritt 2: KI-Antwort einfügen (Textarea)
│   ├── Konfliktstrategie (Überspringen/Duplikat/Ersetzen)
│   └── „Importieren" → Vorschau/Ergebnis (Toast) + Link zum Motiv
└── Hinweis bei Fehlern: „Keine gültigen Motivdaten erkannt"
```

### B) Datenmodell
```
Kein neues Modell. Erzeugt einen Prompt (Text) und importiert eine
KI-Antwort in das bestehende Motivpaket-Format (PROJ-4):
data: { motive: [ein Motiv], saisonphasen: [...] }.
Import schreibt in die Collections "motive" + "saisonphasen".
```

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| Logik in `lib/ki.ts` | Prompt/Extraktion/Normalisierung testbar |
| Wiederverwendung `mergeMotivpaket` | Konsistente Konfliktbehandlung |
| Toleranter Parser + Sanitizing | Robust gegen uneinheitliche KI-Ausgabe |
| Keine KI-API | KI-neutral, kostenlos |

### D) Abhängigkeiten
**Keine neuen Pakete.** Clipboard-API + shadcn/ui (input, textarea, select, radio-group, button, card) + bestehende Backup-Logik/Hooks.

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu: `src/lib/ki.ts` (reine Logik: `buildPrompt`, `extractJsonObject`, `normalizeKiImport` mit Sanitizing) + Seite `/ki-import` (Schritt 1 Prompt erzeugen/kopieren, Schritt 2 Antwort einfügen + Konfliktstrategie + Import). Import nutzt PROJ-4 `mergeMotivpaket` + Hook-`replaceAll`. Navigationspunkt aktiviert.

## QA Test Results

**Tested:** 2026-06-09 · **Tester:** QA Engineer (AI) · **Methode:** Code-Review + Unit (Vitest) + E2E (Playwright via System-Edge).

### Acceptance Criteria Status
- [x] Motivname → strukturierter Prompt mit Kopier-Button
- [x] Kategorie/Region als Hinweise im Prompt enthalten
- [x] Leerer Motivname → verhindert + Hinweis
- [x] Gültige KI-Antwort → Import (Motiv + Saisonphasen) + Link zum Motiv
- [x] Beifang-Text um JSON → automatisch herausgelöst
- [x] Kein gültiges JSON → „Keine gültigen Motivdaten erkannt", nichts geändert
- [x] Namenskonflikt → Überspringen/Duplikat/Ersetzen (PROJ-4-Logik)
- [x] Ergebnismeldung nach Import

### Edge Cases Status
- [x] Unvollständige Daten: Pflicht (Name) erzwungen, ungültige Kategorie→„Tier"
- [x] Ungültige KW in Phasen verworfen; Konfidenz→„mittel"
- [x] Toleranter Parser (Envelope / {motive,saisonphasen} / einzelnes Motiv)

### Security Audit Results
- [x] Keine KI-API/Netzwerk; rein clientseitig (Clipboard + JSON-Parsing)
- [x] Sanitizing schützt Bestand vor fehlerhafter KI-Ausgabe; neue IDs

### Bugs Found
Keine.

### Summary
- **Acceptance Criteria:** alle erfüllt · **Bugs:** 0
- **Unit Tests:** 72/72 grün (inkl. 10 für `ki`)
- **E2E Tests:** 47/47 grün (inkl. 5 PROJ-8) via System-Edge — keine Regressionen
- **Security:** Pass · **Production Ready:** YES

## Deployment
_To be added by /deploy_
