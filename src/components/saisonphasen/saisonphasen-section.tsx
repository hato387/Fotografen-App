"use client";

import { CalendarRange, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  SaisonphaseFormDialog,
  type SaisonphaseInput,
} from "@/components/saisonphasen/saisonphase-form-dialog";
import { KonfidenzBadge } from "@/components/saisonphasen/konfidenz-badge";
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
import { Button } from "@/components/ui/button";
import type { UseCollectionResult } from "@/hooks/use-local-collection";
import { kwSpanne } from "@/lib/kw";
import { Saisonphase } from "@/lib/types";

interface Props {
  motivId: string;
  store: UseCollectionResult<Saisonphase>;
}

export function SaisonphasenSection({ motivId, store }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Saisonphase | undefined>(undefined);
  const [toDelete, setToDelete] = useState<Saisonphase | null>(null);

  const phasen = useMemo(
    () =>
      store.items
        .filter((p) => p.motivId === motivId)
        .sort((a, b) => a.startKW - b.startKW),
    [store.items, motivId],
  );

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (p: Saisonphase) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = (input: SaisonphaseInput) => {
    const now = new Date().toISOString();
    if (editing) {
      store.update(editing.id, { ...input, geaendertAm: now });
      toast.success("Saisonphase aktualisiert.");
    } else {
      const ok = store.add({
        ...input,
        motivId,
        erstelltAm: now,
        geaendertAm: now,
      });
      if (ok) toast.success("Saisonphase hinzugefügt.");
      else if (store.error) toast.error(store.error);
    }
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    store.remove(toDelete.id);
    toast.success("Saisonphase gelöscht.");
    setToDelete(null);
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-card/50 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <CalendarRange className="h-5 w-5 text-primary" />
          Saisonphasen
          {phasen.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({phasen.length})
            </span>
          )}
        </h2>
        <Button size="sm" variant="outline" onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" /> Hinzufügen
        </Button>
      </div>

      {phasen.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Noch keine Saisonphasen. Lege ein Zeitfenster an, um zu wissen, wann
          dieses Motiv lohnt.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {phasen.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-3 py-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {p.bezeichnung || "Aktive Zeit"}
                  </span>
                  {p.hoehepunkt && (
                    <span
                      title="Höhepunkt"
                      className="inline-flex items-center gap-0.5 text-amber-500"
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </span>
                  )}
                  <KonfidenzBadge konfidenz={p.konfidenz} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {kwSpanne(p.startKW, p.endKW)}
                  {p.region && ` · ${p.region}`}
                </div>
                {p.notiz && (
                  <p className="text-sm text-muted-foreground">{p.notiz}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Bearbeiten"
                  onClick={() => openEdit(p)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Löschen"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setToDelete(p)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SaisonphaseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        phase={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Saisonphase löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              „{toDelete?.bezeichnung || "Aktive Zeit"}" wird entfernt. Diese
              Aktion kann nicht rückgängig gemacht werden.
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
    </section>
  );
}
