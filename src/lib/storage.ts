// Geteilte, versionierte localStorage-Schicht.
// Jede Datenart liegt unter eigenem Schlüssel (naturfoto:<collection>).
// Die Format-Version ist die Grundlage für spätere Backups/Importe (PROJ-4).

export const STORAGE_PREFIX = "naturfoto";
export const STORAGE_VERSION = 1;

/** Bekannte Collections der App. */
export type CollectionKey =
  | "motive"
  | "saisonphasen"
  | "fotospots"
  | "fotoeinstellungen";

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

// Same-Tab-Pub/Sub: hält alle Hook-Instanzen einer Collection synchron
// (das storage-Event des Browsers feuert nur in ANDEREN Tabs).
type Listener = () => void;
const listeners = new Map<CollectionKey, Set<Listener>>();

/** Meldet einen Listener an; Rückgabewert ist die Abmelde-Funktion. */
export function subscribeCollection(
  collection: CollectionKey,
  fn: Listener,
): () => void {
  let set = listeners.get(collection);
  if (!set) {
    set = new Set();
    listeners.set(collection, set);
  }
  set.add(fn);
  return () => set.delete(fn);
}

function notifyCollection(collection: CollectionKey): void {
  listeners.get(collection)?.forEach((fn) => fn());
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
  notifyCollection(collection);
}

/**
 * Ersetzt mehrere Collections atomar: schlägt ein Schreibvorgang fehl,
 * werden die bereits geschriebenen auf den vorherigen Stand zurückgerollt.
 * Für Vollbackup-Restore, Importe und Undo. Gibt Erfolg zurück.
 */
export function replaceCollections(
  data: Partial<Record<CollectionKey, unknown[]>>,
): boolean {
  if (!isBrowser()) return false;
  const keys = Object.keys(data) as CollectionKey[];
  const prevRaw = keys.map((k) => window.localStorage.getItem(storageKey(k)));
  try {
    for (const k of keys) {
      window.localStorage.setItem(storageKey(k), JSON.stringify(data[k]));
    }
    if (window.localStorage.getItem(VERSION_KEY) === null) {
      window.localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
    }
    keys.forEach(notifyCollection);
    return true;
  } catch {
    // Rollback der bereits geschriebenen Schlüssel.
    keys.forEach((k, i) => {
      const prev = prevRaw[i];
      try {
        if (prev === null) window.localStorage.removeItem(storageKey(k));
        else window.localStorage.setItem(storageKey(k), prev);
      } catch {
        /* Rollback best effort */
      }
    });
    keys.forEach(notifyCollection);
    return false;
  }
}

/** Erzeugt eine eindeutige ID (eingebaut, ohne Zusatzpaket). */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
