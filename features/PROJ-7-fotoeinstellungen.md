# PROJ-7: Fotoeinstellungen

## Status: Approved
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
| Eigene Collection `naturfoto:fotoeinstellungen`; Navigation aktiviert | Wiederverwendung der Speicher-Schicht; eigenständig | 2026-06-09 |
| Eine Seite mit Karten + Formular-Dialog (kein Detail-Route) | Rezepte sind kompakt; Werte passen auf die Karte | 2026-06-09 |
| Kamera-Werte als Freitext (string) | Variable Schreibweisen (f/5.6, 1/2000, ISO 800) | 2026-06-09 |
| In Vollbackup aufgenommen (PROJ-4 erweitert), NICHT in Motivpaketen | Nicht motivgebunden; Datenschutz-Paket bleibt schlank | 2026-06-09 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
Seite „Fotoeinstellungen" (/fotoeinstellungen) — NEU, Navigation aktiviert
├── Kopf: Titel + „Neue Fotoeinstellung"
├── Textsuche
├── Karten-Raster: Name · Werte (Blende/Zeit/ISO/Brennweite) · Tags
│   └── je Karte: Bearbeiten / Löschen
└── Leerzustand

Formular-Dialog (Anlegen & Bearbeiten): Name* · Blende · Belichtungszeit
· ISO · Brennweite · Ausrüstung · Notiz · Tags
Lösch-Bestätigung
```

### B) Datenmodell
```
- id, name (Pflicht)
- blende?, belichtungszeit?, iso?, brennweite?  (Freitext)
- ausruestung?, notiz?  (Freitext)
- tags: string[]
- erstelltAm / geaendertAm
Gespeichert in: localStorage "naturfoto:fotoeinstellungen".
Teil des Vollbackups (PROJ-4), NICHT der Motivpakete.
```

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| Eigene Collection, eigenständig | Nicht motivgebunden |
| Karten + Dialog (kein Detail) | Kompakte Rezepte |
| Freitext-Werte | Variable Schreibweisen |
| Vollbackup erweitert | Kein Datenverlust beim Restore |

### D) Abhängigkeiten
**Keine neuen Pakete.** shadcn/ui (dialog, input, textarea, badge, button, card) + bestehende Hooks; `TagInput` wiederverwendet.

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu: Collection `naturfoto:fotoeinstellungen` + `Fotoeinstellung`-Typ; `useFotoeinstellungen`; `src/components/fotoeinstellungen/fotoeinstellung-form-dialog.tsx`; Seite `/fotoeinstellungen` (Karten mit Werte-Übersicht + Inline-Bearbeiten/Löschen, Suche, Leerzustand). Navigationspunkt aktiviert.

**Zusätzlich (PROJ-4 erweitert):** Das **Vollbackup** umfasst jetzt auch **Fotospots (PROJ-5)** und **Fotoeinstellungen (PROJ-7)** — `BackupData` erweitert, Export/Restore in `/backup` ergänzt. Motivpakete bleiben datenschutzbereinigt (nur Motive + Saisonphasen).

## QA Test Results

**Tested:** 2026-06-09 · **Tester:** QA Engineer (AI) · **Methode:** Code-Review + Unit (Vitest) + E2E (Playwright via System-Edge).

### Acceptance Criteria Status
- [x] Rezept mit eigenem Namen anlegen
- [x] Name-Pflicht (Validierung)
- [x] Nur mit Namen speicherbar (Werte optional)
- [x] Blende/Belichtungszeit/ISO/Brennweite/Ausrüstung/Notiz als Freitext
- [x] Bearbeiten & Löschen (mit Bestätigung)
- [x] Textsuche (Name/Notiz/Tags) + Leerzustand
- [x] Teil des Vollbackups, nicht der Motivpakete

### Security Audit Results
- [x] Lokal, kein Backend; Texte React-escaped; keine Secrets

### Bugs Found
Keine.

### Summary
- **Acceptance Criteria:** alle erfüllt · **Bugs:** 0
- **Unit Tests:** 62/62 grün (inkl. Vollbackup-Round-Trip mit Zusatz-Collections)
- **E2E Tests:** 42/42 grün (inkl. 6 PROJ-7) via System-Edge — keine Regressionen
- **Security:** Pass · **Production Ready:** YES

## Deployment
_To be added by /deploy_
