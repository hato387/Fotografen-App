"use client";

import { Camera, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FotoeinstellungFormDialog,
  type FotoeinstellungInput,
} from "@/components/fotoeinstellungen/fotoeinstellung-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFotoeinstellungen } from "@/hooks/use-fotoeinstellungen";
import { Fotoeinstellung } from "@/lib/types";

export default function FotoeinstellungenPage() {
  const store = useFotoeinstellungen();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Fotoeinstellung | undefined>(undefined);
  const [toDelete, setToDelete] = useState<Fotoeinstellung | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.items
      .filter((e) => {
        if (!q) return true;
        return (
          e.name.toLowerCase().includes(q) ||
          (e.notiz?.toLowerCase().includes(q) ?? false) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [store.items, query]);

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (e: Fotoeinstellung) => {
    setEditing(e);
    setFormOpen(true);
  };

  const handleSubmit = (input: FotoeinstellungInput) => {
    const now = new Date().toISOString();
    if (editing) {
      store.update(editing.id, { ...input, geaendertAm: now });
      toast.success("Fotoeinstellung aktualisiert.");
    } else {
      const ok = store.add({ ...input, erstelltAm: now, geaendertAm: now });
      if (ok) toast.success(`„${input.name}" angelegt.`);
      else if (store.error) toast.error(store.error);
    }
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    store.remove(toDelete.id);
    toast.success("Fotoeinstellung gelöscht.");
    setToDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Fotoeinstellungen
              </h1>
              {store.loaded && store.items.length > 0 && (
                <Badge variant="secondary" className="rounded-full font-normal">
                  {store.items.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Deine Sammlung an Kamera-Rezepten.
            </p>
          </div>
        </div>
        <Button size="lg" className="rounded-full" onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" /> Neue Fotoeinstellung
        </Button>
      </div>

      {(store.items.length > 0 || !store.loaded) && (
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

      {!store.loaded ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : store.items.length === 0 ? (
        <EmptyState onCreate={openNew} />
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Keine Treffer für deine Suche.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((e) => (
            <RezeptCard
              key={e.id}
              einstellung={e}
              onEdit={() => openEdit(e)}
              onDelete={() => setToDelete(e)}
            />
          ))}
        </div>
      )}

      <FotoeinstellungFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        einstellung={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              „{toDelete?.name}" wirklich löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RezeptCard({
  einstellung: e,
  onEdit,
  onDelete,
}: {
  einstellung: Fotoeinstellung;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const werte = [
    e.blende && { label: "Blende", value: e.blende },
    e.belichtungszeit && { label: "Zeit", value: e.belichtungszeit },
    e.iso && { label: "ISO", value: e.iso },
    e.brennweite && { label: "Brennweite", value: e.brennweite },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Card className="flex h-full flex-col gap-3 rounded-2xl border-border/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{e.name}</h3>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" aria-label="Bearbeiten" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Löschen"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {werte.length > 0 ? (
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
          {werte.map((w) => (
            <div key={w.label} className="flex justify-between gap-2">
              <dt className="text-muted-foreground">{w.label}</dt>
              <dd className="font-medium">{w.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">Keine Werte hinterlegt.</p>
      )}

      {e.ausruestung && (
        <p className="text-sm text-muted-foreground">{e.ausruestung}</p>
      )}

      {e.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {e.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-border/70 bg-card/40 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
        <Camera className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Noch keine Fotoeinstellungen</h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Halte bewährte Kamera-Rezepte fest — z. B. „Vogel im Flug".
        </p>
      </div>
      <Button size="lg" className="rounded-full" onClick={onCreate}>
        <Plus className="mr-1 h-4 w-4" /> Erste Fotoeinstellung anlegen
      </Button>
    </div>
  );
}
