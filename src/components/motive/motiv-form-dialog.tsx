"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { KATEGORIEN, Kategorie, Motiv, Quelle } from "@/lib/types";
import { isSafeHttpUrl, sanitizeUrl } from "@/lib/url";

/** Bereinigte Eingabedaten eines Motivs (ohne id/Zeitstempel). */
export interface MotivInput {
  name: string;
  kategorie: Kategorie;
  beschreibung?: string;
  verhalten?: string;
  lebensraum?: string;
  fototipps?: string;
  ethikhinweise?: string;
  tags: string[];
  quellen: Quelle[];
  bildUrl?: string;
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name ist ein Pflichtfeld."),
  kategorie: z.enum(["Tier", "Pflanze", "Landschaft"], {
    message: "Bitte eine Kategorie wählen.",
  }),
  beschreibung: z.string(),
  verhalten: z.string(),
  lebensraum: z.string(),
  fototipps: z.string(),
  ethikhinweise: z.string(),
  bildUrl: z
    .string()
    .refine((v) => v.trim() === "" || isSafeHttpUrl(v.trim()), {
      message: "Bitte eine vollständige http(s)-Adresse angeben.",
    }),
  tags: z.array(z.string()),
  quellen: z.array(
    z.object({ titel: z.string(), link: z.string() }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

function emptyValues(): FormValues {
  return {
    name: "",
    // Bewusst leer: erzwingt eine aktive Auswahl (Validierung greift).
    kategorie: "" as Kategorie,
    beschreibung: "",
    verhalten: "",
    lebensraum: "",
    fototipps: "",
    ethikhinweise: "",
    bildUrl: "",
    tags: [],
    quellen: [],
  };
}

function motivToValues(m: Motiv): FormValues {
  return {
    name: m.name,
    kategorie: m.kategorie,
    beschreibung: m.beschreibung ?? "",
    verhalten: m.verhalten ?? "",
    lebensraum: m.lebensraum ?? "",
    fototipps: m.fototipps ?? "",
    ethikhinweise: m.ethikhinweise ?? "",
    bildUrl: m.bildUrl ?? "",
    tags: [...m.tags],
    quellen: m.quellen.map((q) => ({ titel: q.titel, link: q.link ?? "" })),
  };
}

const clean = (s: string) => {
  const t = s.trim();
  return t.length > 0 ? t : undefined;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Vorhandenes Motiv → Bearbeiten-Modus; sonst Anlegen-Modus. */
  motiv?: Motiv;
  onSubmit: (input: MotivInput) => void;
}

export function MotivFormDialog({ open, onOpenChange, motiv, onSubmit }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quellen",
  });

  // Formular bei jedem Öffnen mit den passenden Werten füllen.
  useEffect(() => {
    if (open) {
      form.reset(motiv ? motivToValues(motiv) : emptyValues());
    }
  }, [open, motiv, form]);

  const handleSubmit = form.handleSubmit((values) => {
    const input: MotivInput = {
      name: values.name.trim(),
      kategorie: values.kategorie,
      beschreibung: clean(values.beschreibung),
      verhalten: clean(values.verhalten),
      lebensraum: clean(values.lebensraum),
      fototipps: clean(values.fototipps),
      ethikhinweise: clean(values.ethikhinweise),
      bildUrl: sanitizeUrl(values.bildUrl),
      tags: values.tags,
      quellen: values.quellen
        .map((q) => ({ titel: q.titel.trim(), link: sanitizeUrl(q.link) }))
        .filter((q) => q.titel.length > 0),
    };
    onSubmit(input);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {motiv ? "Motiv bearbeiten" : "Neues Motiv"}
          </DialogTitle>
          <DialogDescription>
            Nur Name und Kategorie sind Pflicht — alles andere kannst du später
            ergänzen.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="z. B. Eisvogel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kategorie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorie *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategorie wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {KATEGORIEN.map((k) => (
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
            </div>

            <TextareaField form={form} name="beschreibung" label="Beschreibung" />
            <TextareaField form={form} name="verhalten" label="Verhalten" />
            <TextareaField form={form} name="lebensraum" label="Lebensraum" />
            <TextareaField form={form} name="fototipps" label="Fototipps" />
            <TextareaField
              form={form}
              name="ethikhinweise"
              label="Ethikhinweise"
              placeholder="z. B. Brutzeit: Abstand halten"
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quellen (Titel + optionaler Link) */}
            <div className="space-y-2">
              <Label>Quellen</Label>
              {fields.map((f, index) => (
                <div key={f.id} className="flex items-start gap-2">
                  <Input
                    placeholder="Titel (z. B. NABU-Portal)"
                    {...form.register(`quellen.${index}.titel`)}
                  />
                  <Input
                    placeholder="Link (optional)"
                    {...form.register(`quellen.${index}.link`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Quelle entfernen"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ titel: "", link: "" })}
              >
                <Plus className="mr-1 h-4 w-4" /> Quelle hinzufügen
              </Button>
            </div>

            <FormField
              control={form.control}
              name="bildUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bild-Link (URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://… (optionales Vorschaubild)"
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

/** Wiederkehrendes optionales Textfeld. */
function TextareaField({
  form,
  name,
  label,
  placeholder,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  name: keyof FormValues;
  label: string;
  placeholder?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              rows={3}
              placeholder={placeholder}
              {...field}
              value={field.value as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Einfaches Tag-Eingabefeld: Enter oder Komma fügt hinzu, Klick entfernt. */
function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-2">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 font-normal">
          {tag}
          <button
            type="button"
            aria-label={`Tag ${tag} entfernen`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? "Tag eingeben, Enter…" : ""}
        className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
