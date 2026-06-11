"use client";

import { Leaf, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  MotivFormDialog,
  type MotivInput,
} from "@/components/motive/motiv-form-dialog";
import { MotivCard } from "@/components/motive/motiv-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMotive } from "@/hooks/use-motive";
import { KATEGORIEN, Kategorie } from "@/lib/types";

type Filter = "Alle" | Kategorie;

export default function MotivePage() {
  const { items, loaded, error, add } = useMotive();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Alle");
  const [formOpen, setFormOpen] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((m) => (filter === "Alle" ? true : m.kategorie === filter))
      .filter((m) => {
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          (m.beschreibung?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [items, query, filter]);

  const handleCreate = (input: MotivInput) => {
    const now = new Date().toISOString();
    const created = add({ ...input, erstelltAm: now, geaendertAm: now });
    if (created) toast.success(`Motiv „${created.name}" angelegt.`);
    else if (error) toast.error(error);
  };

  return (
    <div className="space-y-8">
      {/* Kopfbereich */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Motive – Arten &amp; Landschaften
              </h1>
              {loaded && items.length > 0 && (
                <Badge variant="secondary" className="rounded-full font-normal">
                  {items.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Beschreibung, Verhalten, Fototipps &amp; Saisonphasen – an einem Ort.
            </p>
          </div>
        </div>
        <Button size="lg" className="rounded-full" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Neues Motiv
        </Button>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Werkzeugleiste */}
      {(items.length > 0 || !loaded) && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche nach Name, Tag oder Beschreibung…"
              className="rounded-full border-border/60 bg-background pl-9"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="rounded-full">
              <TabsTrigger value="Alle" className="rounded-full">
                Alle
              </TabsTrigger>
              {KATEGORIEN.map((k) => (
                <TabsTrigger key={k} value={k} className="rounded-full">
                  {k}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Inhalt */}
      {!loaded ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState onCreate={() => setFormOpen(true)} />
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <Search className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            Keine Treffer für deine Suche oder deinen Filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
            <MotivCard key={m.id} motiv={m} />
          ))}
        </div>
      )}

      <MotivFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border border-dashed border-border/70 bg-card/40 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
        <Leaf className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Noch keine Motive</h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Lege dein erstes Motiv an — z. B. „Eisvogel" — und reichere es nach und
          nach mit Wissen an.
        </p>
      </div>
      <Button size="lg" className="rounded-full" onClick={onCreate}>
        <Plus className="mr-1 h-4 w-4" /> Erstes Motiv anlegen
      </Button>
    </div>
  );
}
