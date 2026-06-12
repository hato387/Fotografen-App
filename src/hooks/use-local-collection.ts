"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CollectionKey,
  createId,
  readCollection,
  storageKey,
  subscribeCollection,
  writeCollection,
} from "@/lib/storage";

/** Minimaler gemeinsamer Nenner aller Datensätze. */
interface Entity {
  id: string;
}

export interface UseCollectionResult<T extends Entity> {
  items: T[];
  /** false bis localStorage gelesen wurde (vermeidet Hydration-Mismatch). */
  loaded: boolean;
  /** Letzter Schreibfehler (z. B. Speicher voll) oder null. */
  error: string | null;
  getById: (id: string) => T | undefined;
  add: (data: Omit<T, "id">) => T | null;
  /** true bei Erfolg, false bei Schreibfehler (z. B. Speicher voll). */
  update: (id: string, patch: Partial<Omit<T, "id">>) => boolean;
  /** true bei Erfolg, false bei Schreibfehler. */
  remove: (id: string) => boolean;
  /** Entfernt alle Elemente, die das Prädikat erfüllen (in einem Schreibvorgang). */
  removeWhere: (predicate: (item: T) => boolean) => boolean;
  /** Ersetzt die gesamte Collection (für Restore/Import). */
  replaceAll: (items: T[]) => boolean;
}

/**
 * Liest/schreibt eine localStorage-Collection und hält die Oberfläche aktuell.
 * Wiederverwendbar für alle Datenarten (Motive, später Saisonphasen, Spots …).
 */
export function useLocalCollection<T extends Entity>(
  collection: CollectionKey,
): UseCollectionResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Erstes Laden + Reaktion auf Änderungen aus diesem Tab (Pub/Sub,
  // hält mehrere Hook-Instanzen synchron) und aus anderen Tabs (storage-Event).
  useEffect(() => {
    const refresh = () => setItems(readCollection<T>(collection));
    refresh();
    // localStorage ist erst im Browser lesbar — das initiale Einlesen im
    // Effect (inkl. loaded-Flag) ist hier gewollt (Hydration-sicher).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);

    const unsubscribe = subscribeCollection(collection, refresh);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey(collection)) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [collection]);

  const persist = useCallback(
    (next: T[]): boolean => {
      try {
        writeCollection<T>(collection, next);
        setItems(next);
        setError(null);
        return true;
      } catch {
        setError(
          "Speichern fehlgeschlagen — der lokale Speicher ist möglicherweise voll.",
        );
        return false;
      }
    },
    [collection],
  );

  const getById = useCallback(
    (id: string) => items.find((it) => it.id === id),
    [items],
  );

  const add = useCallback(
    (data: Omit<T, "id">): T | null => {
      const entity = { ...data, id: createId() } as T;
      const ok = persist([...items, entity]);
      return ok ? entity : null;
    },
    [items, persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<T, "id">>): boolean =>
      persist(items.map((it) => (it.id === id ? { ...it, ...patch } : it))),
    [items, persist],
  );

  const remove = useCallback(
    (id: string): boolean =>
      persist(items.filter((it) => it.id !== id)),
    [items, persist],
  );

  const removeWhere = useCallback(
    (predicate: (item: T) => boolean): boolean =>
      persist(items.filter((it) => !predicate(it))),
    [items, persist],
  );

  const replaceAll = useCallback(
    (next: T[]): boolean => persist(next),
    [persist],
  );

  return {
    items,
    loaded,
    error,
    getById,
    add,
    update,
    remove,
    removeWhere,
    replaceAll,
  };
}
