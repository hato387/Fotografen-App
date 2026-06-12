# PROJ-2: Saisonphasen

## Status: Approved
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
| Eigene Collection `naturfoto:saisonphasen` mit `motivId` (statt im Motiv eingebettet) | Kalender (PROJ-3) liest motivübergreifend; sauberes Kaskaden-Löschen per `motivId` | 2026-06-09 |
| Wiederverwendung von `useLocalCollection` (aus PROJ-1) | Kein neuer Speichercode; konsistente Logik & Fehlerbehandlung | 2026-06-09 |
| KW→Monat als reine Anzeige-Hilfe (Näherung) | KW variiert leicht je Jahr; für Orientierung genügt eine feste Zuordnung | 2026-06-09 |
| KW-Auswahl (1–53) statt Freitext-Zahl | Verhindert ungültige Eingaben, bessere Bedienung | 2026-06-09 |
| Phasen-Formular & Lösch-Dialog als Dialog (wie Motiv) | Konsistente UX, gleiche shadcn-Bausteine | 2026-06-09 |
| Kaskaden-Löschen + dynamische Warnung im Motiv-Lösch-Dialog (`warning`-Prop) | Erfüllt PROJ-1-Löschregel; nutzt die in PROJ-1 vorbereitete Prop | 2026-06-09 |

---

## Implementation Notes (Frontend)
**Stand 2026-06-09 — UI implementiert, Build grün.**

Neu/erweitert:
- **Datenmodell:** `Saisonphase` + `Konfidenz` in `src/lib/types.ts`; Collection `"saisonphasen"` in `src/lib/storage.ts`.
- **Hooks:** `src/hooks/use-saisonphasen.ts`; `useLocalCollection` um **`removeWhere(predicate)`** erweitert (für Kaskaden-Löschen in einem Schreibvorgang).
- **Hilfen:** `src/lib/kw.ts` (KW-Liste 1–53, `kwToMonat`-Näherung, `kwSpanne`, `istJahresuebergang`), `src/lib/konfidenz.ts` (Badge-Farben).
- **Komponenten:** `src/components/saisonphasen/` — `saisonphasen-section.tsx` (Liste, Leerzustand, Add/Edit/Delete), `saisonphase-form-dialog.tsx` (RHF+Zod, KW-Selects mit Monatsanzeige, Höhepunkt-Switch, Jahresübergang-Hinweis), `konfidenz-badge.tsx`.
- **Integration:** Abschnitt „Saisonphasen" in `/motive/[id]`. **Kaskaden-Löschen** beim Motiv-Löschen + **dynamische Warnung** (Anzahl Phasen) über die PROJ-1-`warning`-Prop.

Hinweis: Es wird bewusst **eine** `useSaisonphasen`-Instanz auf der Detailseite gehalten und an die Section übergeben. *(Seit 2026-06-12 zusätzlich abgesichert: Same-Tab-Pub/Sub in der Speicher-Schicht hält alle Hook-Instanzen synchron.)*

**Nachbesserungen (2026-06-12):** KW-Eingabe als **Direkteingabe** (Zahlenfeld 1–53 mit Live-Monatsanzeige) statt 53-Einträge-Dropdown (Mängelliste #6); Formular mit `noValidate` (einheitliche deutsche Zod-Meldungen). Saisonphase-Löschen mit **„Rückgängig"-Toast** (#10).

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Komponentenstruktur
```
Seite „Motiv-Detail" (/motive/[id]) — bestehende Seite, erweitert
└── NEUER Abschnitt „Saisonphasen"
    ├── Kopfzeile: Titel + Button „Saisonphase hinzufügen"
    ├── Liste der Phasen (zum Motiv)
    │   └── Phasen-Zeile: Bezeichnung · KW-Spanne (+ Monat) · Konfidenz-Badge
    │       · ⭐ Höhepunkt · Region · Bearbeiten/Löschen
    └── Leerzustand: „Noch keine Saisonphasen — hinzufügen"

Saisonphasen-Formular (Dialog, Anlegen & Bearbeiten)
├── Bezeichnung (Freitext, optional)
├── Start-KW + End-KW (Auswahl 1–53, mit Monatsanzeige)
├── Region (Freitext, optional)
├── Konfidenz (niedrig/mittel/hoch, Default „mittel")
├── Höhepunkt (Schalter)
└── Notiz (Freitext, optional)

Lösch-Bestätigung für eine Phase (kurzer Dialog)
```
> Die Karten-Übersicht (`/motive`) bleibt unverändert. Die motivübergreifende Sicht kommt mit dem Kalender (PROJ-3).

### B) Datenmodell (in Worten)
```
Eine Saisonphase hat:
- Eindeutige ID (automatisch erzeugt)
- motivId (Verweis auf das zugehörige Motiv)
- Bezeichnung (optional)
- startKW (1–53), endKW (1–53)   → startKW > endKW = Jahresübergang
- Region (optional)
- Konfidenz: niedrig | mittel | hoch (Default „mittel")
- Höhepunkt: ja/nein (Default nein)
- Notiz (optional)
- Erstellt-am / Geändert-am

Gespeichert in: localStorage, Schlüssel "naturfoto:saisonphasen"
(eigene Collection, NICHT im Motiv eingebettet)
```
**Kaskaden-Löschen:** Beim Löschen eines Motivs werden alle Phasen mit passender `motivId` entfernt; der Motiv-Lösch-Dialog zeigt die Anzahl betroffener Phasen (über die in PROJ-1 vorbereitete `warning`-Prop).

### C) Tech-Entscheidungen
| Entscheidung | Warum |
|--------------|-------|
| Eigene Collection mit `motivId` | Kalender liest motivübergreifend; Kaskaden-Löschen |
| `useLocalCollection` wiederverwenden | Kein neuer Speichercode |
| KW→Monat als Anzeige-Hilfe | Orientierung ohne echte Jahres-Rechnung |
| KW-Auswahl statt Freitext | Keine ungültigen Eingaben |
| Dialog-Formular wie Motiv | Konsistente UX |

### D) Abhängigkeiten
**Keine neuen Pakete.** Vorhanden: shadcn/ui (dialog, select, switch, badge, button, label, input, textarea), `useLocalCollection` und das Motiv-Detail-Gerüst aus PROJ-1.

## QA Test Results

**Tested:** 2026-06-09
**App URL:** http://localhost:3000
**Tester:** QA Engineer (AI)
**Methode:** Code-Review aller Akzeptanzkriterien + Unit-Tests (Vitest) + E2E-Tests (Playwright, gegen System-Edge via `playwright.edge.config.ts`).

### Acceptance Criteria Status
- [x] Phase anlegen (Start-/End-KW + Konfidenz) → erscheint in der Phasenliste des Motivs
- [x] Start/End-KW sind Pflicht (Auswahl 1–53; Default KW 1) — ungültige Werte über die Auswahl gar nicht möglich
- [x] KW außerhalb 1–53 nicht eingebbar (Select statt Freitext → Validierungspfad konstruktiv ausgeschlossen)
- [x] Start > End → als Jahresübergang akzeptiert + Hinweis im Formular
- [x] Default-Konfidenz „mittel"
- [x] Phase bearbeiten → Änderung sichtbar
- [x] Phase löschen → kurzer Bestätigungsdialog
- [x] Monat zur Orientierung neben KW (Auswahl „KW n · Monat", Liste „KW a–b (Mon–Mon)")
- [x] Leerzustand bei 0 Phasen

### Edge Cases Status
- [x] Einzelne Woche (Start = End) zulässig
- [x] Jahresübergang (Start > End) korrekt + Hinweis
- [x] Überlappende Phasen erlaubt (kein Block)
- [x] KW 53 wählbar
- [x] Motiv ohne Phasen → Leerzustand
- [x] Motiv gelöscht → zugehörige Phasen werden kaskadiert mitgelöscht; Lösch-Dialog zeigt die Anzahl

### Security Audit Results
- [x] Kein Backend/Auth (lokal, Single-User)
- [x] Freitexte (Bezeichnung/Region/Notiz) React-escaped; keine neuen URL-Eingaben
- [x] Keine Secrets

### Bugs Found
Keine.

### Summary
- **Acceptance Criteria:** alle erfüllt
- **Bugs:** 0 (0 Critical/High/Medium/Low)
- **Unit Tests:** 27/27 grün (inkl. `kw`-Helfer + `removeWhere`)
- **E2E Tests:** 19/19 grün (12 PROJ-1 + 7 PROJ-2; via System-Edge) — keine Regressionen
- **Security:** Pass
- **Production Ready:** YES
- **Recommendation:** Deploy-fähig.

## Deployment
_To be added by /deploy_
