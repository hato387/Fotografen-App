"use client";

import { useLocalCollection } from "@/hooks/use-local-collection";
import { Saisonphase } from "@/lib/types";

/** Saisonphasen aus localStorage (PROJ-2). Dünne Hülle um useLocalCollection. */
export function useSaisonphasen() {
  return useLocalCollection<Saisonphase>("saisonphasen");
}
