// URL-Sicherheit: nur http(s) zulassen, um z. B. `javascript:`-Schemata
// in Quellen-Links und Bild-URLs zu neutralisieren (Defense-in-Depth).

export function isSafeHttpUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Gibt die URL zurück, wenn sie http(s) ist — sonst undefined (verworfen). */
export function sanitizeUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  return trimmed && isSafeHttpUrl(trimmed) ? trimmed : undefined;
}
