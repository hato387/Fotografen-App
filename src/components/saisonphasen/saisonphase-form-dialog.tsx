"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ALLE_KW, istJahresuebergang, kwLabel } from "@/lib/kw";
import { Konfidenz, KONFIDENZEN, Saisonphase } from "@/lib/types";

/** Bereinigte Eingabedaten einer Phase (ohne id/motivId/Zeitstempel). */
export interface SaisonphaseInput {
  bezeichnung?: string;
  startKW: number;
  endKW: number;
  region?: string;
  konfidenz: Konfidenz;
  hoehepunkt: boolean;
  notiz?: string;
}

const formSchema = z.object({
  bezeichnung: z.string(),
  startKW: z.number().int().min(1).max(53),
  endKW: z.number().int().min(1).max(53),
  region: z.string(),
  konfidenz: z.enum(["niedrig", "mittel", "hoch"]),
  hoehepunkt: z.boolean(),
  notiz: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

function emptyValues(): FormValues {
  return {
    bezeichnung: "",
    startKW: 1,
    endKW: 1,
    region: "",
    konfidenz: "mittel",
    hoehepunkt: false,
    notiz: "",
  };
}

function phaseToValues(p: Saisonphase): FormValues {
  return {
    bezeichnung: p.bezeichnung ?? "",
    startKW: p.startKW,
    endKW: p.endKW,
    region: p.region ?? "",
    konfidenz: p.konfidenz,
    hoehepunkt: p.hoehepunkt,
    notiz: p.notiz ?? "",
  };
}

const clean = (s: string) => {
  const t = s.trim();
  return t.length > 0 ? t : undefined;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase?: Saisonphase;
  onSubmit: (input: SaisonphaseInput) => void;
}

export function SaisonphaseFormDialog({
  open,
  onOpenChange,
  phase,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (open) form.reset(phase ? phaseToValues(phase) : emptyValues());
  }, [open, phase, form]);

  const startKW = form.watch("startKW");
  const endKW = form.watch("endKW");

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      bezeichnung: clean(values.bezeichnung),
      startKW: values.startKW,
      endKW: values.endKW,
      region: clean(values.region),
      konfidenz: values.konfidenz,
      hoehepunkt: values.hoehepunkt,
      notiz: clean(values.notiz),
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {phase ? "Saisonphase bearbeiten" : "Neue Saisonphase"}
          </DialogTitle>
          <DialogDescription>
            Zeitfenster als Kalenderwochen. Start nach Ende = über den
            Jahreswechsel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="bezeichnung"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bezeichnung</FormLabel>
                  <FormControl>
                    <Input placeholder="z. B. Balz, Blüte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <KwField form={form} name="startKW" label="Start-KW *" />
              <KwField form={form} name="endKW" label="End-KW *" />
            </div>
            {istJahresuebergang(startKW, endKW) && (
              <p className="text-xs text-muted-foreground">
                Diese Phase läuft über den Jahreswechsel (Dez → Jan).
              </p>
            )}

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z. B. Süddeutschland, bundesweit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="konfidenz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfidenz</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {KONFIDENZEN.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoehepunkt"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Höhepunkt</FormLabel>
                    <FormDescription>
                      Beste Zeit (z. B. Brutzeit) — im Kalender filterbar.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notiz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notiz</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="z. B. Hauptaktivität früh morgens"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit">Speichern</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/** KW-Auswahl 1–53 mit Monatsanzeige. */
function KwField({
  form,
  name,
  label,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  name: "startKW" | "endKW";
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={String(field.value)}
            onValueChange={(v) => field.onChange(Number(v))}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-72">
              {ALLE_KW.map((w) => (
                <SelectItem key={w} value={String(w)}>
                  {kwLabel(w)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
