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
| PROJ-1 | Motive-Datenbank | Planned | [Spec](PROJ-1-motive-datenbank.md) | 2026-06-09 |
| PROJ-2 | Saisonphasen | Planned | [Spec](PROJ-2-saisonphasen.md) | 2026-06-09 |
| PROJ-3 | Kalender | Roadmap | — | 2026-06-09 |
| PROJ-4 | Backup/Import | Roadmap | — | 2026-06-09 |
| PROJ-5 | Fotospots | Roadmap | — | 2026-06-09 |
| PROJ-6 | Journal | Roadmap | — | 2026-06-09 |
| PROJ-7 | Fotoeinstellungen | Roadmap | — | 2026-06-09 |
| PROJ-8 | KI-Motiv-Prompt-Generator | Roadmap | — | 2026-06-09 |

<!-- Add features above this line -->

## Feature Details & Dependencies

| ID | Feature | Prio | Hängt ab von | Beschreibung |
|----|---------|------|--------------|--------------|
| PROJ-1 | Motive-Datenbank | P0 | — | Arten/Landschaften anlegen & verwalten: Beschreibung, Verhalten, Lebensraum, Fototipps, Ethikhinweise, Tags, Quellen |
| PROJ-2 | Saisonphasen | P0 | PROJ-1 | Zeitfenster (Kalenderwochen) je Motiv mit Region & Konfidenz |
| PROJ-3 | Kalender | P0 | PROJ-1, PROJ-2 | Wochenansicht + Jahres-Timeline, filterbar (Kategorie, Text, Art, Aktiv/Bevorstehend, Relevanz) |
| PROJ-4 | Backup/Import | P0 | PROJ-1 | Voll-Backup (JSON) + Motiv-Datenpakete, datenschutzbereinigt |
| PROJ-5 | Fotospots | P1 | — | GPS-Koordinaten-Verwaltung für Orte |
| PROJ-6 | Journal | P1 | PROJ-1, PROJ-5 | Eigene Beobachtungen, verknüpft mit Motiv & Spot |
| PROJ-7 | Fotoeinstellungen | P1 | PROJ-1 | Kameraeinstellungen (Blende, ISO, Brennweite …) je Motiv |
| PROJ-8 | KI-Motiv-Prompt-Generator | P1 | PROJ-1, PROJ-2 (Format abgestimmt mit PROJ-4) | Motivname → strukturierter KI-Prompt → KI-Ausgabe (Motivfelder **+ Saisonphasen**) direkt importierbar |

**Empfohlene Baureihenfolge:** PROJ-1 → PROJ-2 → PROJ-3 → PROJ-4 *(MVP fertig)* → PROJ-5 → PROJ-6 → PROJ-7 → PROJ-8

## Next Available ID: PROJ-9
