"use client";

import { useLocalCollection } from "@/hooks/use-local-collection";
import { Fotoeinstellung } from "@/lib/types";

/** Fotoeinstellungen aus localStorage (PROJ-7). */
export function useFotoeinstellungen() {
  return useLocalCollection<Fotoeinstellung>("fotoeinstellungen");
}
