// Geteilte, versionierte localStorage-Schicht.
// Jede Datenart liegt unter eigenem Schlüssel (naturfoto:<collection>).
// Die Format-Version ist die Grundlage für spätere Backups/Importe (PROJ-4).

export const STORAGE_PREFIX = "naturfoto";
export const STORAGE_VERSION = 1;

/** Bekannte Collections der App. Wird mitwachsen (saisonphasen, fotospots …). */
export type CollectionKey = "motive";

export function storageKey(collection: CollectionKey): string {
  return `${STORAGE_PREFIX}:${collection}`;
}

const VERSION_KEY = `${STORAGE_PREFIX}:version`;

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** Liest eine Collection als Array. Gibt bei Fehlern/leer ein leeres Array zurück. */
export function readCollection<T>(collection: CollectionKey): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(collection));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Schreibt eine Collection. Wirft bei Speicherproblemen (z. B. Kontingent voll),
 * damit die Oberfläche eine Fehlermeldung anzeigen kann.
 */
export function writeCollection<T>(collection: CollectionKey, items: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(storageKey(collection), JSON.stringify(items));
  // Format-Version festhalten (einmalig / idempotent).
  if (window.localStorage.getItem(VERSION_KEY) === null) {
    window.localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
  }
}

/** Erzeugt eine eindeutige ID (eingebaut, ohne Zusatzpaket). */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
