"use client";

import { CalendarRange } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { JahresTimeline } from "@/components/kalender/jahres-timeline";
import { KalenderFilterBar } from "@/components/kalender/kalender-filter-bar";
import {
  WochenAnsicht,
  type KalenderRow,
} from "@/components/kalender/wochen-ansicht";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMotive } from "@/hooks/use-motive";
import { useSaisonphasen } from "@/hooks/use-saisonphasen";
import {
  DEFAULT_FILTER,
  KalenderFilter,
  motivPasses,
  phasePassesQuality,
} from "@/lib/kalender";
import { getCurrentKW } from "@/lib/kw";
import { isActiveInKW, isUpcoming } from "@/lib/saison";
import { Saisonphase } from "@/lib/types";

function phasePassesStatus(
  p: Saisonphase,
  status: KalenderFilter["status"],
  currentKW: number,
): boolean {
  if (status === "aktiv") return isActiveInKW(p, currentKW);
  if (status === "bevorstehend") return isUpcoming(p, currentKW, 4);
  return true;
}

export default function KalenderPage() {
  const motive = useMotive();
  const saison = useSaisonphasen();
  const [filter, setFilter] = useState<KalenderFilter>(DEFAULT_FILTER);
  const [currentKW, setCurrentKW] = useState<number>(() => getCurrentKW());

  const loaded = motive.loaded && saison.loaded;

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    motive.items.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "de"));
  }, [motive.items]);

  const rows: KalenderRow[] = useMemo(() => {
    return motive.items
      .filter((m) => motivPasses(m, filter))
      .map((m) => ({
        motiv: m,
        phasen: saison.items
          .filter((p) => p.motivId === m.id)
          .filter((p) => phasePassesQuality(p, filter))
          .filter((p) => phasePassesStatus(p, filter.status, currentKW))
          .sort((a, b) => a.startKW - b.startKW),
      }))
      .filter((r) => r.phasen.length > 0)
      .sort((a, b) => a.motiv.name.localeCompare(b.motiv.name, "de"));
  }, [motive.items, saison.items, filter, currentKW]);

  if (!loaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
          <CalendarRange className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
          <p className="text-sm text-muted-foreground">
            Was lohnt sich wann? Wochenansicht &amp; Jahres-Timeline.
          </p>
        </div>
      </div>

      {motive.items.length === 0 ? (
        <EmptyHint
          text="Noch keine Motive. Lege zuerst Motive samt Saisonphasen an."
        />
      ) : (
        <>
          <KalenderFilterBar
            filter={filter}
            onChange={setFilter}
            availableTags={availableTags}
          />

          <Tabs defaultValue="woche" className="space-y-4">
            <TabsList className="rounded-full">
              <TabsTrigger value="woche" className="rounded-full">
                Woche
              </TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-full">
                Jahres-Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="woche">
              <WochenAnsicht
                rows={rows}
                currentKW={currentKW}
                onKwChange={setCurrentKW}
              />
            </TabsContent>

            <TabsContent value="timeline">
              {rows.length === 0 ? (
                <EmptyHint text="Keine Treffer für die aktuellen Filter." />
              ) : (
                <JahresTimeline rows={rows} currentKW={currentKW} />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      <Button asChild variant="outline">
        <Link href="/motive">Zu den Motiven</Link>
      </Button>
    </div>
  );
}
