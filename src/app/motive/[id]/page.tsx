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
import { KategorieBadge } from "@/components/motive/kategorie-badge";
import { MotivDeleteDialog } from "@/components/motive/motiv-delete-dialog";
import {
  MotivFormDialog,
  type MotivInput,
} from "@/components/motive/motiv-form-dialog";
import { SaisonphasenSection } from "@/components/saisonphasen/saisonphasen-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFotospots } from "@/hooks/use-fotospots";
import { useMotive } from "@/hooks/use-motive";
import { useSaisonphasen } from "@/hooks/use-saisonphasen";
import { isSafeHttpUrl } from "@/lib/url";

export default function MotivDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { loaded, getById, update, remove } = useMotive();
  const saisonStore = useSaisonphasen();
  const spotsStore = useFotospots();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const motiv = getById(params.id);

  if (!loaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!motiv) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Dieses Motiv existiert nicht (mehr).</p>
        <Button asChild variant="outline">
          <Link href="/motive">
            <ArrowLeft className="mr-1 h-4 w-4" /> Zurück zur Übersicht
          </Link>
        </Button>
      </div>
    );
  }

  const handleUpdate = (input: MotivInput) => {
    const ok = update(motiv.id, {
      ...input,
      geaendertAm: new Date().toISOString(),
    });
    if (ok) toast.success("Änderungen gespeichert.");
    else
      toast.error(
        "Speichern fehlgeschlagen — der lokale Speicher ist möglicherweise voll.",
      );
  };

  const phaseCount = saisonStore.items.filter(
    (p) => p.motivId === motiv.id,
  ).length;
  const verknuepfteSpots = spotsStore.items.filter((s) =>
    s.motivIds.includes(motiv.id),
  );

  const handleDelete = () => {
    const name = motiv.name;
    // Kaskade: Saisonphasen löschen, Spot-Verknüpfungen bereinigen.
    if (phaseCount > 0) saisonStore.removeWhere((p) => p.motivId === motiv.id);
    if (verknuepfteSpots.length > 0) {
      spotsStore.replaceAll(
        spotsStore.items.map((s) =>
          s.motivIds.includes(motiv.id)
            ? { ...s, motivIds: s.motivIds.filter((id) => id !== motiv.id) }
            : s,
        ),
      );
    }
    const ok = remove(motiv.id);
    if (!ok) {
      toast.error("Löschen fehlgeschlagen — bitte erneut versuchen.");
      return;
    }
    toast.success(`Motiv „${name}" gelöscht.`);
    router.push("/motive");
  };

  const warnParts: string[] = [];
  if (phaseCount > 0)
    warnParts.push(
      phaseCount === 1
        ? "1 Saisonphase wird mitgelöscht"
        : `${phaseCount} Saisonphasen werden mitgelöscht`,
    );
  if (verknuepfteSpots.length > 0)
    warnParts.push(
      verknuepfteSpots.length === 1
        ? "die Verknüpfung bei 1 Fotospot wird entfernt"
        : `die Verknüpfungen bei ${verknuepfteSpots.length} Fotospots werden entfernt`,
    );
  const deleteWarning =
    warnParts.length > 0 ? `Dazu: ${warnParts.join("; ")}.` : undefined;

  const showImage = isSafeHttpUrl(motiv.bildUrl) && !imgError;
  const hasContent = Boolean(
    motiv.beschreibung ||
      motiv.verhalten ||
      motiv.lebensraum ||
      motiv.fototipps ||
      motiv.ethikhinweise ||
      motiv.quellen.length > 0,
  );

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/motive">
          <ArrowLeft className="mr-1 h-4 w-4" /> Übersicht
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {motiv.name}
            </h1>
            <KategorieBadge kategorie={motiv.kategorie} />
          </div>
          {motiv.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {motiv.tags.map((t) => (
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

      {showImage && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={motiv.bildUrl}
            alt={motiv.name}
            className="max-h-[26rem] w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {isSafeHttpUrl(motiv.bildUrl) && imgError && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          <ImageOff className="h-4 w-4" /> Bild-Link konnte nicht geladen werden.
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
        {hasContent ? (
          <div className="space-y-6">
            <Field label="Beschreibung" value={motiv.beschreibung} />
            <Field label="Verhalten" value={motiv.verhalten} />
            <Field label="Lebensraum" value={motiv.lebensraum} />
            <Field label="Fototipps" value={motiv.fototipps} />
            <Field label="Ethikhinweise" value={motiv.ethikhinweise} />

            {motiv.quellen.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Quellen
                </h3>
                <ul className="space-y-1.5">
                  {motiv.quellen.map((q, i) => (
                    <li key={i}>
                      {isSafeHttpUrl(q.link) ? (
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          {q.titel}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span>{q.titel}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Dieses Motiv hat noch keine Details. Klick auf „Bearbeiten", um
            Beschreibung, Fototipps & Co. zu ergänzen.
          </p>
        )}
      </div>

      {/* PROJ-2: Saisonphasen */}
      {saisonStore.loaded && (
        <SaisonphasenSection motivId={motiv.id} store={saisonStore} />
      )}

      {/* PROJ-5: Fotospots, an denen dieses Motiv verknüpft ist */}
      {spotsStore.loaded && verknuepfteSpots.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card/50 p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            Fotospots mit diesem Motiv
            <span className="text-sm font-normal text-muted-foreground">
              ({verknuepfteSpots.length})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {verknuepfteSpots.map((s) => (
              <Button
                key={s.id}
                asChild
                variant="secondary"
                size="sm"
                className="rounded-full"
              >
                <Link href={`/fotospots/${s.id}`}>{s.name}</Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        Angelegt am {formatDate(motiv.erstelltAm)}
        {motiv.geaendertAm !== motiv.erstelltAm &&
          ` · zuletzt geändert am ${formatDate(motiv.geaendertAm)}`}
      </p>

      <MotivFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        motiv={motiv}
        onSubmit={handleUpdate}
      />
      <MotivDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        motiv={motiv}
        onConfirm={handleDelete}
        warning={deleteWarning}
      />
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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
