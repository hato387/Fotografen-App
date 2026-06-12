# Design System — Naturnah v2

> Ruhiges, naturnahes Theme für die Naturfotografie-App. Lesbarkeit vor Effekt.
> v2 (Redesign 2026-06-12): App-Shell mit Sidebar, Dashboard, kühlere Salbei-Palette.

## Prinzipien
- Ruhig, viel Weißraum, abgerundete Karten (weiße Karten auf sanft getöntem Grund)
- Lesbarkeit der vielen Beschreibungstexte (Motive, Fototipps) steht im Vordergrund
- Gedeckte, naturnahe Töne — kein grelles UI
- Dark Mode (praktisch bei Dämmerung/früh morgens im Feld)

## Layout (App-Shell)
- **Sidebar links** (einklappbar auf Icons; mobil als Sheet), gruppiert:
  *Planung* (Übersicht/Dashboard, Saison-Kalender) · *Sammlung* (Motive, Fotospots,
  Fotoeinstellungen) · *Werkzeuge* (KI-Import, Backup & Import)
- **Kopfleiste** schlank: Sidebar-Trigger + Theme-Umschalter
- **Inhalt** zentriert, `max-w-5xl`
- **Startseite = Dashboard:** aktuelle KW, Kennzahlen, „Jetzt aktiv" / „Bald
  interessant", Onboarding bei leerer App
- **Einheitlicher Seitenkopf** über `PageHeader` (Icon-Kachel, Titel, Beschreibung,
  Anzahl-Badge, Aktionen rechts)

## Farbpalette (HSL, siehe globals.css)

### Hell-Modus
| Rolle | HSL |
|-------|-----|
| Hintergrund (Salbei-Weiß) | `140 20% 97%` |
| Karten | Weiß |
| Primär (tiefes Waldgrün) | `152 42% 26%` |
| Text (Grün-Anthrazit) | `160 25% 12%` |

### Dunkel-Modus
| Rolle | HSL |
|-------|-----|
| Hintergrund (Waldgrün-Schwarz) | `160 14% 8%` |
| Primär (leuchtendes Salbeigrün) | `150 42% 56%` |

### Kategorie-Akzente
Tier = Amber · Pflanze = Smaragd · Landschaft = Himmelblau
(Styling-Maps in `src/lib/kategorie.ts` — **Achtung:** `src/lib` muss im
Tailwind-`content`-Glob bleiben, sonst fehlen die Klassen.)

## Typografie
- **Schrift:** Inter, Radius `0.75rem`
- Deutsche Anführungszeichen typografisch: „…“

## Komponenten
- Basis: Tailwind CSS + shadcn/ui (inkl. Sidebar)
- Karten-basiertes Layout; Lösch-Aktionen mit Bestätigung + „Rückgängig"-Toast
