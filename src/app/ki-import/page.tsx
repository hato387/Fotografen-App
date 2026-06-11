"use client";

import { Check, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMotive } from "@/hooks/use-motive";
import { useSaisonphasen } from "@/hooks/use-saisonphasen";
import { mergeMotivpaket, type Konfliktstrategie } from "@/lib/backup";
import { buildPrompt, extractJsonObject, normalizeKiImport } from "@/lib/ki";
import { Kategorie, KATEGORIEN } from "@/lib/types";

export default function KiImportPage() {
  const motive = useMotive();
  const saison = useSaisonphasen();

  const [name, setName] = useState("");
  const [kategorie, setKategorie] = useState<Kategorie | "">("");
  const [region, setRegion] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [response, setResponse] = useState("");
  const [strategie, setStrategie] =
    useState<Konfliktstrategie>("ueberspringen");
  const [lastImportedId, setLastImportedId] = useState<string | null>(null);

  const erzeugePrompt = () => {
    if (!name.trim()) {
      toast.error("Bitte einen Motivnamen eingeben.");
      return;
    }
    setPrompt(buildPrompt({ name, kategorie, region }));
    setCopied(false);
  };

  const kopieren = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Prompt in die Zwischenablage kopiert.");
    } catch {
      toast.error("Kopieren nicht möglich — bitte manuell markieren.");
    }
  };

  const importieren = () => {
    setLastImportedId(null);
    try {
      const data = normalizeKiImport(extractJsonObject(response));
      const merge = mergeMotivpaket(
        { motive: motive.items, saisonphasen: saison.items },
        data,
        strategie,
      );
      const ok =
        motive.replaceAll(merge.motive) &&
        saison.replaceAll(merge.saisonphasen);
      if (!ok) {
        toast.error("Import fehlgeschlagen — Speicher möglicherweise voll.");
        return;
      }
      const existingIds = new Set(motive.items.map((m) => m.id));
      const neu = merge.motive.find(
        (m) => !existingIds.has(m.id) && m.name === data.motive[0].name,
      );
      setLastImportedId(neu?.id ?? null);
      toast.success(
        `Import: ${merge.summary.hinzugefuegt} hinzugefügt, ${merge.summary.ersetzt} ersetzt, ${merge.summary.uebersprungen} übersprungen · ${data.saisonphasen.length} Saisonphasen.`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Keine gültigen Motivdaten erkannt.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            KI-Motiv-Import
          </h1>
          <p className="text-sm text-muted-foreground">
            Motiv per KI fachlich befüllen — Prompt erzeugen, Antwort
            importieren.
          </p>
        </div>
      </div>

      {/* Schritt 1 */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">1 · Prompt erzeugen</CardTitle>
          <CardDescription>
            Motivname eingeben, optional Kategorie und Region als Hinweis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="ki-name">Motivname *</Label>
              <Input
                id="ki-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Eisvogel"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Kategorie</Label>
              <Select
                value={kategorie || "auto"}
                onValueChange={(v) =>
                  setKategorie(v === "auto" ? "" : (v as Kategorie))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">(offen lassen)</SelectItem>
                  {KATEGORIEN.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ki-region">Region</Label>
              <Input
                id="ki-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="z. B. Süddeutschland"
              />
            </div>
          </div>

          <Button onClick={erzeugePrompt}>Prompt erzeugen</Button>

          {prompt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Prompt — in eine beliebige KI einfügen:
                </Label>
                <Button variant="outline" size="sm" onClick={kopieren}>
                  {copied ? (
                    <Check className="mr-1 h-4 w-4" />
                  ) : (
                    <Copy className="mr-1 h-4 w-4" />
                  )}
                  Kopieren
                </Button>
              </div>
              <Textarea
                readOnly
                value={prompt}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schritt 2 */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">2 · KI-Antwort importieren</CardTitle>
          <CardDescription>
            Antwort der KI hier einfügen. Text um das JSON herum wird automatisch
            ignoriert.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={8}
            placeholder="KI-Antwort hier einfügen…"
            aria-label="KI-Antwort"
            className="font-mono text-xs"
          />

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Bei Namenskonflikt:
            </Label>
            <RadioGroup
              value={strategie}
              onValueChange={(v) => setStrategie(v as Konfliktstrategie)}
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
                  <RadioGroupItem value={val} id={`ki-${val}`} />
                  <Label htmlFor={`ki-${val}`} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={importieren} disabled={!response.trim()}>
              Importieren
            </Button>
            {lastImportedId && (
              <Button asChild variant="link">
                <Link href={`/motive/${lastImportedId}`}>
                  Zum importierten Motiv →
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
