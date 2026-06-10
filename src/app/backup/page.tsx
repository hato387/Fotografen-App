"use client";

import { Download, Save, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMotive } from "@/hooks/use-motive";
import { useSaisonphasen } from "@/hooks/use-saisonphasen";
import {
  backupDateiname,
  buildBackup,
  buildMotivpaket,
  type BackupEnvelope,
  type Konfliktstrategie,
  mergeMotivpaket,
  parseEnvelope,
} from "@/lib/backup";

function downloadJson(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BackupPage() {
  const motive = useMotive();
  const saison = useSaisonphasen();
  const fileInput = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<{
    envelope: BackupEnvelope;
    fileName: string;
  } | null>(null);
  const [strategie, setStrategie] =
    useState<Konfliktstrategie>("ueberspringen");
  const [confirmRestore, setConfirmRestore] = useState(false);

  const loaded = motive.loaded && saison.loaded;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const alleWaehlen = () =>
    setSelected(
      selected.size === motive.items.length
        ? new Set()
        : new Set(motive.items.map((m) => m.id)),
    );

  const exportVollbackup = () => {
    const env = buildBackup("vollbackup", {
      motive: motive.items,
      saisonphasen: saison.items,
    });
    downloadJson(backupDateiname("vollbackup"), env);
    toast.success("Vollbackup exportiert.");
  };

  const exportMotive = () => {
    const env = buildMotivpaket([...selected], motive.items, saison.items);
    downloadJson(backupDateiname("motivpaket"), env);
    toast.success(`${selected.size} Motiv(e) exportiert.`);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const env = parseEnvelope(await file.text());
      setPreview({ envelope: env, fileName: file.name });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import fehlgeschlagen.");
      setPreview(null);
    }
    e.target.value = "";
  };

  const applyImport = () => {
    if (!preview) return;
    const { envelope } = preview;

    if (envelope.type === "vollbackup") {
      const ok =
        motive.replaceAll(envelope.data.motive) &&
        saison.replaceAll(envelope.data.saisonphasen);
      ok
        ? toast.success(
            `Vollbackup wiederhergestellt (${envelope.data.motive.length} Motive).`,
          )
        : toast.error("Import fehlgeschlagen — Speicher möglicherweise voll.");
    } else {
      const merge = mergeMotivpaket(
        { motive: motive.items, saisonphasen: saison.items },
        envelope.data,
        strategie,
      );
      const ok =
        motive.replaceAll(merge.motive) &&
        saison.replaceAll(merge.saisonphasen);
      ok
        ? toast.success(
            `Import: ${merge.summary.hinzugefuegt} hinzugefügt, ${merge.summary.ersetzt} ersetzt, ${merge.summary.uebersprungen} übersprungen.`,
          )
        : toast.error("Import fehlgeschlagen — Speicher möglicherweise voll.");
    }
    setPreview(null);
  };

  const onImportClick = () => {
    if (!preview) return;
    if (preview.envelope.type === "vollbackup") setConfirmRestore(true);
    else applyImport();
  };

  if (!loaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
          <Save className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Backup &amp; Import
          </h1>
          <p className="text-sm text-muted-foreground">
            Alles lokal — nichts verlässt dein Gerät.
          </p>
        </div>
      </div>

      {/* Vollbackup */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Vollbackup</CardTitle>
          <CardDescription>
            Sichert alle Daten (Motive &amp; Saisonphasen) als JSON-Datei — zum
            Sichern oder für einen Geräteumzug.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={exportVollbackup}>
            <Download className="mr-1 h-4 w-4" /> Vollbackup exportieren
          </Button>
        </CardContent>
      </Card>

      {/* Motive teilen */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Motive teilen</CardTitle>
          <CardDescription>
            Datenschutzbereinigtes Paket aus ausgewählten Motiven (inkl.
            Saisonphasen) — ohne private Daten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {motive.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Noch keine Motive zum Exportieren.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={alleWaehlen}>
                  {selected.size === motive.items.length
                    ? "Auswahl aufheben"
                    : "Alle auswählen"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selected.size} ausgewählt
                </span>
              </div>
              <ScrollArea className="h-44 rounded-lg border">
                <ul className="p-2">
                  {motive.items.map((m) => (
                    <li key={m.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent">
                        <Checkbox
                          checked={selected.has(m.id)}
                          onCheckedChange={() => toggle(m.id)}
                        />
                        <span className="text-sm">{m.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <Button onClick={exportMotive} disabled={selected.size === 0}>
                <Download className="mr-1 h-4 w-4" /> Auswahl exportieren
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Importieren */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Importieren</CardTitle>
          <CardDescription>
            Vollbackup (ersetzt alle Daten) oder Motivpaket (wird
            zusammengeführt).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            onChange={onFile}
            className="hidden"
            aria-label="Importdatei wählen"
          />
          <Button variant="outline" onClick={() => fileInput.current?.click()}>
            <Upload className="mr-1 h-4 w-4" /> Datei wählen…
          </Button>

          {preview && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <div className="text-sm">
                <span className="font-medium">{preview.fileName}</span> —{" "}
                {preview.envelope.type === "vollbackup"
                  ? "Vollbackup"
                  : "Motivpaket"}
                : {preview.envelope.data.motive.length} Motive,{" "}
                {preview.envelope.data.saisonphasen.length} Saisonphasen
              </div>

              {preview.envelope.type === "motivpaket" && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Bei Namenskonflikt:
                  </Label>
                  <RadioGroup
                    value={strategie}
                    onValueChange={(v) =>
                      setStrategie(v as Konfliktstrategie)
                    }
                    className="gap-1"
                  >
                    {(
                      [
                        ["ueberspringen", "Überspringen"],
                        ["duplikat", "Als Duplikat hinzufügen"],
                        ["ersetzen", "Bestehendes ersetzen"],
                      ] as const
                    ).map(([val, label]) => (
                      <div key={val} className="flex items-center gap-2">
                        <RadioGroupItem value={val} id={`s-${val}`} />
                        <Label htmlFor={`s-${val}`} className="cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {preview.envelope.type === "vollbackup" && (
                <p className="text-sm text-destructive">
                  Achtung: Ein Vollbackup-Import ersetzt alle aktuellen Daten.
                </p>
              )}

              <Button onClick={onImportClick}>Importieren</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmRestore} onOpenChange={setConfirmRestore}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alle Daten ersetzen?</AlertDialogTitle>
            <AlertDialogDescription>
              Der Import dieses Vollbackups überschreibt alle aktuellen Motive
              und Saisonphasen. Erwäge, vorher selbst ein Backup zu exportieren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={applyImport}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ersetzen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
