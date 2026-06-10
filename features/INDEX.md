# Feature Index

> Central tracking for all features. Updated by skills automatically.

## Status Legend
- **Roadmap** - `/init` done, feature identified in feature map, no spec file yet
- **Planned** - `/write-spec` done, full spec written, architecture not yet designed
- **Architected** - `/architecture` done, tech design approved, ready to build
- **In Progress** - `/frontend` or `/backend` active or completed, not yet in QA
- **In Review** - `/qa` active, testing in progress
- **Approved** - `/qa` passed, no critical/high bugs, ready to deploy
- **Deployed** - `/deploy` done, live in production

## Features

| ID | Feature | Status | Spec | Created |
|----|---------|--------|------|---------|
| PROJ-1 | Motive-Datenbank | Approved | [Spec](PROJ-1-motive-datenbank.md) | 2026-06-09 |
| PROJ-2 | Saisonphasen | Planned | [Spec](PROJ-2-saisonphasen.md) | 2026-06-09 |
| PROJ-3 | Kalender | Planned | [Spec](PROJ-3-kalender.md) | 2026-06-09 |
| PROJ-4 | Backup/Import | Planned | [Spec](PROJ-4-backup-import.md) | 2026-06-09 |
| PROJ-5 | Fotospots (inkl. Beobachtungen & Ideen) | Planned | [Spec](PROJ-5-fotospots.md) | 2026-06-09 |
| PROJ-6 | Journal | ~~Zusammengelegt mit PROJ-5~~ | — | 2026-06-09 |
| PROJ-7 | Fotoeinstellungen | Planned | [Spec](PROJ-7-fotoeinstellungen.md) | 2026-06-09 |
| PROJ-8 | KI-Motiv-Prompt-Generator | Planned | [Spec](PROJ-8-ki-motiv-prompt-generator.md) | 2026-06-09 |

<!-- Add features above this line -->

## Feature Details & Dependencies

| ID | Feature | Prio | Hängt ab von | Beschreibung |
|----|---------|------|--------------|--------------|
| PROJ-1 | Motive-Datenbank | P0 | — | Arten/Landschaften anlegen & verwalten: Beschreibung, Verhalten, Lebensraum, Fototipps, Ethikhinweise, Tags, Quellen |
| PROJ-2 | Saisonphasen | P0 | PROJ-1 | Zeitfenster (Kalenderwochen) je Motiv mit Region & Konfidenz |
| PROJ-3 | Kalender | P0 | PROJ-1, PROJ-2 | Wochenansicht + Jahres-Timeline, filterbar (Kategorie, Text, Art, Aktiv/Bevorstehend, Relevanz) |
| PROJ-4 | Backup/Import | P0 | PROJ-1 | Voll-Backup (JSON) + Motiv-Datenpakete, datenschutzbereinigt |
| PROJ-5 | Fotospots (inkl. Beobachtungen & Ideen) | P1 | PROJ-1 | Orte mit optionalem GPS, verknüpften Motiven, Beobachtungen/Fotoideen (Freitext) und Timing-Notiz. **Vereint Fotospots + Journal** |
| PROJ-6 | ~~Journal~~ | — | — | **Zusammengelegt mit PROJ-5** — kein eigenes Feature mehr (keine separate Journal-Flut) |
| PROJ-7 | Fotoeinstellungen | P1 | — | Eigenständige Sammlung von Kamera-Einstellungs-Rezepten (selbst benannt, z. B. „Vogel im Flug"); **nicht** motivgebunden |
| PROJ-8 | KI-Motiv-Prompt-Generator | P1 | PROJ-1, PROJ-2 (Format abgestimmt mit PROJ-4) | Motivname → strukturierter KI-Prompt → KI-Ausgabe (Motivfelder **+ Saisonphasen**) direkt importierbar |

**Empfohlene Baureihenfolge:** PROJ-1 → PROJ-2 → PROJ-3 → PROJ-4 *(MVP fertig)* → PROJ-5 → PROJ-7 → PROJ-8 *(PROJ-6 entfällt)*

## Next Available ID: PROJ-9
