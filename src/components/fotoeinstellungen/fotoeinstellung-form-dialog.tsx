"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TagInput } from "@/components/tag-input";
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
import { Textarea } from "@/components/ui/textarea";
import { Fotoeinstellung } from "@/lib/types";

export interface FotoeinstellungInput {
  name: string;
  blende?: string;
  belichtungszeit?: string;
  iso?: string;
  brennweite?: string;
  ausruestung?: string;
  notiz?: string;
  tags: string[];
}

const schema = z.object({
  name: z.string().trim().min(1, "Name ist ein Pflichtfeld."),
  blende: z.string(),
  belichtungszeit: z.string(),
  iso: z.string(),
  brennweite: z.string(),
  ausruestung: z.string(),
  notiz: z.string(),
  tags: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

function emptyValues(): FormValues {
  return {
    name: "",
    blende: "",
    belichtungszeit: "",
    iso: "",
    brennweite: "",
    ausruestung: "",
    notiz: "",
    tags: [],
  };
}

function toValues(e: Fotoeinstellung): FormValues {
  return {
    name: e.name,
    blende: e.blende ?? "",
    belichtungszeit: e.belichtungszeit ?? "",
    iso: e.iso ?? "",
    brennweite: e.brennweite ?? "",
    ausruestung: e.ausruestung ?? "",
    notiz: e.notiz ?? "",
    tags: [...e.tags],
  };
}

const clean = (s: string) => {
  const t = s.trim();
  return t.length > 0 ? t : undefined;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  einstellung?: Fotoeinstellung;
  onSubmit: (input: FotoeinstellungInput) => void;
}

export function FotoeinstellungFormDialog({
  open,
  onOpenChange,
  einstellung,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (open) form.reset(einstellung ? toValues(einstellung) : emptyValues());
  }, [open, einstellung, form]);

  const handleSubmit = form.handleSubmit((v) => {
    onSubmit({
      name: v.name.trim(),
      blende: clean(v.blende),
      belichtungszeit: clean(v.belichtungszeit),
      iso: clean(v.iso),
      brennweite: clean(v.brennweite),
      ausruestung: clean(v.ausruestung),
      notiz: clean(v.notiz),
      tags: v.tags,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {einstellung ? "Fotoeinstellung bearbeiten" : "Neue Fotoeinstellung"}
          </DialogTitle>
          <DialogDescription>
            Nur der Name ist Pflicht. Werte als Freitext (z. B. „f/5.6",
            „1/2000").
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="z. B. Vogel im Flug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField form={form} name="blende" label="Blende" placeholder="f/5.6" />
              <TextField
                form={form}
                name="belichtungszeit"
                label="Belichtungszeit"
                placeholder="1/2000 s"
              />
              <TextField form={form} name="iso" label="ISO" placeholder="800" />
              <TextField
                form={form}
                name="brennweite"
                label="Brennweite"
                placeholder="400 mm"
              />
            </div>

            <TextField
              form={form}
              name="ausruestung"
              label="Ausrüstung"
              placeholder="Kamera / Objektiv"
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
                      placeholder="Kontext, Lichtsituation, Stativ/Freihand…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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

function TextField({
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
            <Input
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
