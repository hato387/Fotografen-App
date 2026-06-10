# PROJ-4: Backup/Import

## Status: Approved
**Created:** 2026-06-09
**Last Updated:** 2026-06-09

## Dependencies
- **PROJ-1** (Motive) — Mindestinhalt. Bezieht weitere Datentypen ein, sobald vorhanden: **PROJ-2** (Saisonphasen), **PROJ-5** (Fotospots, inkl. Beobachtungen/Ideen), **PROJ-7** (Fotoeinstellungen).

## User Stories
- Als Naturfotograf möchte ich ein Vollbackup meiner gesamten App-Daten als Datei exportieren, damit ich sie sichern und auf ein anderes Gerät übertragen kann.
- Als Naturfotograf möchte ich ein Vollbackup wieder importieren, damit ich meinen kompletten Stand wiederherstellen kann.
- Als Naturfotograf möchte ich ausgewählte Motive als datenschutzbereinigtes Paket exportieren, damit ich Artenwissen teilen kann, ohne private Daten preiszugeben.
- Als Naturfotograf möchte ich ein Motivpaket importieren und es mit meiner Sammlung zusammenführen, damit ich gezielt ergänze.
- Als Naturfotograf möchte ich vor jedem Import eine Vorschau und klare Warnungen sehen, damit ich keine Daten versehentlich verliere.

## Export-Arten
**📦 Vollbackup** (für dich selbst — Sicherung/Geräteumzug)
- Enthält **alle** App-Daten: Motive, Saisonphasen, Fotospots (inkl. GPS, Beobachtungen & Ideen), Fotoeinstellungen (sofern vorhanden).
- **Nicht** datenschutzbereinigt.

**🌱 Motivdatenpaket** (zum Teilen / als KI-Importformat für PROJ-8)
- Enthält **ausgewählte Motive** (Mehrfachauswahl) samt Wissen: Beschreibung, Verhalten, Lebensraum, Fototipps, Ethik, Tags, Quellen, **Saisonphasen**.
- **Datenschutzbereinigt:** **keine** Fotospots (also keine GPS-Daten, Beobachtungen oder privaten Ideen-Notizen).

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
- [ ] Angenommen ich wähle „Motive exportieren", wenn ich bestimmte Motive auswähle und exportiere, dann enthält die Datei nur deren Wissen + Saisonphasen, **ohne** Fotospots (keine GPS-Daten, Beobachtungen oder privaten Notizen).
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
| Datenschutzbereinigt = ohne Fotospots (GPS/Beobachtungen/Notizen) | Nur allgemeingültiges Wissen wird geteilt | 2026-06-09 |
| Vollbackup = ersetzen, Motivpaket = zusammenführen | Snapshot-Restore vs. gezieltes Ergänzen | 2026-06-09 |
| Namenskonflikt: Überspringen/Duplikat/Ersetzen | Volle Kontrolle beim Zusammenführen | 2026-06-09 |
| Versioniertes JSON + harte Importprüfung | Zukunftssicher; kein Datenverlust bei Fehlern | 2026-06-09 |
| Motivpaket-Format = KI-Importformat (PROJ-8) | Eine Quelle der Wahrheit für Import | 2026-06-09 |

### Technical Decisions
<!-- Added by /architecture -->
| Decision | Rationale | Date |
|----------|-----------|------|
| Eigene Seite `/backup`, in der Navigation aktiviert | Zentraler Ort für Export/Import | 2026-06-09 |
| Versioniertes Envelope-Format `{ app, type, version, exportedAt, data }` | Erkennbar, prüfbar, zukunftssicher (Grundlage PROJ-8) | 2026-06-09 |
| Reine Backup-Logik in `src/lib/backup.ts` (unit-getestet) | Bauen/Parsen/Mergen isoliert testbar | 2026-06-09 |
| Import-IDs bei Motivpaket neu vergeben + `motivId` neu verdrahten | Verhindert ID-Kollisionen beim Zusammenführen | 2026-06-09 |
| Konfliktstrategie global (Überspringen/Duplikat/Ersetzen) statt pro Eintrag | Deutlich einfachere UX; deckt die AC ab | 2026-06-09 |
| `replaceAll()` am Speicher-Hook ergänzt | Restore (Vollbackup) und Merge atomar schreiben | 2026-06-09 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
Seite „Backup & Import" (/backup) — NEU, in Navigation aktiviert
├── Karte „Vollbackup"
│   └── Button „Vollbackup exportieren" (lädt JSON-Datei herunter)
├── Karte „Motive teilen"
│   ├── Motiv-Auswahl (Checkboxliste, „alle" möglich)
│   └── Button „Auswahl exportieren" (datenschutzbereinigt)
└── Karte „Importieren"
    ├── Datei wählen (Upload)
    ├── Vorschau (Typ · Anzahl Motive/Phasen)
    ├── bei Motivpaket: Konfliktstrategie (Überspringen/Duplikat/Ersetzen)
    └── Button „Importieren" → Ergebnismeldung (Toast)
```

### B) Datenmodell (Datei-Envelope)
```
{ app: "naturfoto", type: "vollbackup" | "motivpaket",
  version: 1, exportedAt: ISO-Datum,
  data: { motive: [...], saisonphasen: [...] } }

- Vollbackup: alle Collections (Motive + Saisonphasen …). Restore = ersetzen.
- Motivpaket: ausgewählte Motive + deren Saisonphasen. Merge = hinzufügen.
  Datenschutzbereinigt = enthält KEINE Fotospots/Beobachtungen (PROJ-5).
```

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| Envelope mit `type`+`version` | Erkennung/Validierung, Basis für PROJ-8 |
| Logik in `lib/backup.ts` | Reine, testbare Funktionen (bauen/parsen/mergen) |
| Neue IDs bei Paket-Import | Keine Kollisionen beim Zusammenführen |
| Globale Konfliktstrategie | Einfache, klare UX |
| `replaceAll()` am Hook | Atomares Restore/Merge, UI bleibt aktuell |

### D) Abhängigkeiten
**Keine neuen Pakete.** Browser-APIs (Blob/Download, FileReader) + bestehende Hooks/Storage-Schicht.

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu:
- **Seite `/backup`** (`src/app/backup/page.tsx`); Navigationspunkt „Backup" aktiviert.
- **Reine Backup-Logik (unit-getestet):** `src/lib/backup.ts` — `buildBackup`, `buildMotivpaket`, `backupDateiname`, `parseEnvelope` (Validierung), `mergeMotivpaket` (Konfliktstrategien mit ID-Neuvergabe).
- **Speicher-Hook** um `replaceAll()` erweitert (atomares Restore/Merge).
- Export = Blob-Download; Import = versteckter File-Input + `FileReader`. Vollbackup-Import hinter Bestätigungsdialog.

## QA Test Results

**Tested:** 2026-06-09 · **Tester:** QA Engineer (AI) · **Methode:** Code-Review + Unit (Vitest) + E2E (Playwright via System-Edge).

### Acceptance Criteria Status
- [x] Vollbackup exportieren → JSON mit Kopfdaten (Typ/Version/Datum)
- [x] Motive exportieren (Auswahl) → nur Wissen + Saisonphasen, ohne private Daten
- [x] Vollbackup importieren → ersetzt alle Daten nach Warnung
- [x] Motivpaket importieren ohne Konflikt → hinzugefügt
- [x] Namenskonflikt → Überspringen / Duplikat / Ersetzen wählbar
- [x] Ungültige/beschädigte Datei → Fehlermeldung, Daten unverändert
- [x] Unbekannte Version → abgelehnt mit Hinweis
- [x] Vorschau (Typ + Anzahl) vor dem Anwenden
- [x] Ergebnismeldung nach Import (Toast)

### Edge Cases Status
- [x] Leere App → Vollbackup-Export erzeugt gültige Datei
- [x] Abgebrochener/ungültiger Import → kein Teil-Schreiben (atomar via replaceAll)
- [x] Manipulierte Datei → Schema-Prüfung greift
- [x] Motivpaket ohne Saisonphasen zulässig
- [x] Import-IDs neu vergeben → keine Kollisionen

### Security Audit Results
- [x] Rein lokal (Blob/FileReader), nichts verlässt das Gerät
- [x] Strikte Envelope-Validierung vor jeder Änderung
- [x] Motivpaket datenschutzbereinigt (keine Fotospots/Beobachtungen — PROJ-5)

### Bugs Found
Keine. (Während der Testerstellung 1 Test-Bug gefunden & behoben: `addInitScript`-Seeding überschrieb den Import bei Navigation → auf einmaliges `evaluate`+`reload` umgestellt.)

### Summary
- **Acceptance Criteria:** alle erfüllt
- **Bugs:** 0
- **Unit Tests:** 54/54 grün (inkl. 12 für `backup`)
- **E2E Tests:** 29/29 grün (12 PROJ-1 + 7 PROJ-2 + 6 PROJ-3 + 4 PROJ-4; via System-Edge) — keine Regressionen
- **Security:** Pass
- **Production Ready:** YES
- **Recommendation:** Deploy-fähig. **MVP komplett.**

## Deployment
_To be added by /deploy_
