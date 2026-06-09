"use client";

import { useLocalCollection } from "@/hooks/use-local-collection";
import { Motiv } from "@/lib/types";

/** Motive aus localStorage (PROJ-1). Dünne Hülle um useLocalCollection. */
export function useMotive() {
  return useLocalCollection<Motiv>("motive");
}
