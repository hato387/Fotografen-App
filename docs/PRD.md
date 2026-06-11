# Product Requirements Document

## Vision
Eine persönliche, lokal laufende Wissens- und Planungs-App für die Naturfotografie. Sie beantwortet die drei Kernfragen jedes Naturfotografen — *Was* kann ich fotografieren (Motive), *wann* (Saisonphasen/Kalender) und *wo* (Fotospots) — und hält in einem Journal fest, was tatsächlich beobachtet wurde. Alles vollständig offline und im eigenen Besitz.

## Target Users
Ambitionierter Hobby-Naturfotograf (Einzelnutzer). **Pain Point heute:** Wissen über Arten, beste Zeitfenster, Orte und gelungene Kameraeinstellungen liegt verstreut in Notizen, im Kopf und im Netz. Diese App bündelt alles an einem Ort, vollständig offline und in eigener Kontrolle.

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | Motive-Datenbank | Approved |
| P0 (MVP) | Saisonphasen je Motiv | Approved |
| P0 (MVP) | Kalender (Woche + Jahres-Timeline, filterbar) | Approved |
| P0 (MVP) | Backup/Import (JSON) | Approved |
| P1 | Fotospots (inkl. Beobachtungen & Ideen) | Approved |
| ~~P1~~ | ~~Journal~~ (zusammengelegt mit Fotospots) | Entfällt |
| P1 | Fotoeinstellungen (eigenständige Rezept-Sammlung) | Approved |
| P1 | KI-Motiv-Prompt-Generator | Approved |

## Success Metrics
- Regelmäßige Nutzung zur Shooting-Planung
- Stetig wachsender Bestand an Motiv- und Saison-Daten
- Jederzeit ein verlässliches JSON-Backup vorhanden

## Constraints
- Solo-Hobbyprojekt, kein Zeitdruck
- **Kein Backend — nur localStorage** (rein lokale Persistenz, keine Cloud)
- Keine echten Bilddateien — Bilder nur als optionale Links/URLs
- Design system: see `docs/design-system.md`

## Non-Goals
- Keine Cloud, kein Multi-User, keine Geräte-Synchronisierung
- Kein Upload echter Fotodateien
- Keine native Mobile-App (läuft als Web-App im Browser)

---

Use `/write-spec` to create detailed feature specifications for each item in the roadmap above.
