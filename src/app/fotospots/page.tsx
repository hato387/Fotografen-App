"use client";

import { MapPin, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FotospotFormDialog,
  type FotospotInput,
} from "@/components/fotospots/fotospot-form-dialog";
import { FotospotCard } from "@/components/fotospots/fotospot-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFotospots } from "@/hooks/use-fotospots";
import { useMotive } from "@/hooks/use-motive";

export default function FotospotsPage() {
  const spots = useFotospots();
  const motive = useMotive();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const loaded = spots.loaded && motive.loaded;

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    motive.items.forEach((m) => map.set(m.id, m.name));
    return map;
  }, [motive.items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return spots.items
      .filter((s) => {
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          (s.beobachtungen?.toLowerCase().includes(q) ?? false) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [spots.items, query]);

  const handleCreate = (input: FotospotInput) => {
    const now = new Date().toISOString();
    const created = spots.add({ ...input, erstelltAm: now, geaendertAm: now });
    if (created) toast.success(`Fotospot „${created.name}" angelegt.`);
    else if (spots.error) toast.error(spots.error);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Fotospots &amp; Beobachtungen
              </h1>
              {loaded && spots.items.length > 0 && (
                <Badge variant="secondary" className="rounded-full font-normal">
                  {spots.items.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Deine Orte mit GPS, verknüpften Motiven und Fotoideen.
            </p>
          </div>
        </div>
        <Button size="lg" className="rounded-full" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Neuer Fotospot
        </Button>
      </div>

      {spots.error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {spots.error}
        </p>
      )}

      {(spots.items.length > 0 || !loaded) && (
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Name, Notiz oder Tag…"
            className="rounded-full border-border/60 bg-background pl-9"
          />
        </div>
      )}

      {!loaded ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : spots.items.length === 0 ? (
        <EmptyState onCreate={() => setFormOpen(true)} />
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Keine Treffer für deine Suche.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <FotospotCard
              key={s.id}
              spot={s}
              motivNames={s.motivIds
                .map((id) => nameById.get(id))
                .filter((n): n is string => Boolean(n))}
            />
          ))}
        </div>
      )}

      <FotospotFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        motive={motive.items}
        onSubmit={handleCreate}
      />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-border/70 bg-card/40 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
        <MapPin className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Noch keine Fotospots</h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Halte deine besten Orte fest — mit GPS, verknüpften Motiven und
          Beobachtungen.
        </p>
      </div>
      <Button size="lg" className="rounded-full" onClick={onCreate}>
        <Plus className="mr-1 h-4 w-4" /> Ersten Fotospot anlegen
      </Button>
    </div>
  );
}
