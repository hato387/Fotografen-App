// Geo-Hilfen für Fotospots (PROJ-5). Keine Karten-Bibliothek — nur Validierung
// und ein Link auf eine externe Karte.

export function isValidLat(n: number): boolean {
  return Number.isFinite(n) && n >= -90 && n <= 90;
}

export function isValidLng(n: number): boolean {
  return Number.isFinite(n) && n >= -180 && n <= 180;
}

/**
 * Parst eine Koordinaten-Eingabe (toleriert Komma statt Punkt).
 * → null bei leer, NaN bei ungültig, sonst die Zahl.
 */
export function parseCoord(value: string): number | null {
  const t = value.trim().replace(",", ".");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

/** Link auf OpenStreetMap an den Koordinaten. */
export function mapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
}

export function hasCoords(spot: {
  lat?: number;
  lng?: number;
}): spot is { lat: number; lng: number } {
  return typeof spot.lat === "number" && typeof spot.lng === "number";
}
