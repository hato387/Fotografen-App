"use client";

import {
  ArrowLeft,
  ExternalLink,
  ImageOff,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  FotospotFormDialog,
  type FotospotInput,
} from "@/components/fotospots/fotospot-form-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useFotospots } from "@/hooks/use-fotospots";
import { useMotive } from "@/hooks/use-motive";
import { hasCoords, mapUrl } from "@/lib/geo";
import { replaceCollections } from "@/lib/storage";
import { isSafeHttpUrl } from "@/lib/url";

export default function FotospotDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const spots = useFotospots();
  const motive = useMotive();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const loaded = spots.loaded && motive.loaded;
  const spot = spots.getById(params.id);

  if (!loaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">
          Dieser Fotospot existiert nicht (mehr).
        </p>
        <Button asChild variant="outline">
          <Link href="/fotospots">
            <ArrowLeft className="mr-1 h-4 w-4" /> Zurück zur Übersicht
          </Link>
        </Button>
      </div>
    );
  }

  const verknuepfteMotive = spot.motivIds
    .map((id) => motive.items.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const handleUpdate = (input: FotospotInput) => {
    const ok = spots.update(spot.id, {
      ...input,
      geaendertAm: new Date().toISOString(),
    });
    if (ok) toast.success("Änderungen gespeichert.");
    else toast.error("Speichern fehlgeschlagen — Speicher möglicherweise voll.");
  };

  const handleDelete = () => {
    const name = spot.name;
    const snapshot = spots.items;
    const ok = spots.remove(spot.id);
    if (!ok) {
      toast.error("Löschen fehlgeschlagen — bitte erneut versuchen.");
      return;
    }
    toast.success(`Fotospot „${name}" gelöscht.`, {
      duration: 6000,
      action: {
        label: "Rückgängig",
        onClick: () => {
          if (replaceCollections({ fotospots: snapshot }))
            toast.success(`„${name}" wiederhergestellt.`);
          else toast.error("Wiederherstellen fehlgeschlagen.");
        },
      },
    });
    router.push("/fotospots");
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/fotospots">
          <ArrowLeft className="mr-1 h-4 w-4" /> Übersicht
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{spot.name}</h1>
          {hasCoords(spot) && (
            <a
              href={mapUrl(spot.lat, spot.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" /> Auf Karte öffnen ({spot.lat},{" "}
              {spot.lng})
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {spot.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {spot.tags.map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-1 h-4 w-4" /> Bearbeiten
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-1 h-4 w-4" /> Löschen
          </Button>
        </div>
      </div>

      {isSafeHttpUrl(spot.bildUrl) && !imgError && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={spot.bildUrl}
            alt={spot.name}
            className="max-h-[26rem] w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {isSafeHttpUrl(spot.bildUrl) && imgError && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          <ImageOff className="h-4 w-4" /> Bild-Link konnte nicht geladen werden.
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-6">
        {verknuepfteMotive.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Verknüpfte Motive
            </h3>
            <div className="flex flex-wrap gap-2">
              {verknuepfteMotive.map((m) => (
                <Button
                  key={m.id}
                  asChild
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href={`/motive/${m.id}`}>{m.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        <Field label="Beobachtungen & Fotoideen" value={spot.beobachtungen} />
        <Field label="Beste Zeit" value={spot.besteZeit} />

        {verknuepfteMotive.length === 0 &&
          !spot.beobachtungen &&
          !spot.besteZeit && (
            <p className="text-center text-sm text-muted-foreground">
              Noch keine Details. Klick auf „Bearbeiten“, um Motive, Notizen &
              Co. zu ergänzen.
            </p>
          )}
      </div>

      <FotospotFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        spot={spot}
        motive={motive.items}
        onSubmit={handleUpdate}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Fotospot „{spot.name}“ wirklich löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <h3 className="mb-1 text-sm font-medium text-muted-foreground">{label}</h3>
      <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}
