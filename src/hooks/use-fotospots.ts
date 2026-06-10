"use client";

import { useLocalCollection } from "@/hooks/use-local-collection";
import { Fotospot } from "@/lib/types";

/** Fotospots aus localStorage (PROJ-5). */
export function useFotospots() {
  return useLocalCollection<Fotospot>("fotospots");
}
