"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MotivMultiSelect } from "@/components/fotospots/motiv-multi-select";
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
import { isValidLat, isValidLng, parseCoord } from "@/lib/geo";
import { Fotospot, Motiv } from "@/lib/types";
import { isSafeHttpUrl, sanitizeUrl } from "@/lib/url";

export interface FotospotInput {
  name: string;
  lat?: number;
  lng?: number;
  motivIds: string[];
  beobachtungen?: string;
  besteZeit?: string;
  tags: string[];
  bildUrl?: string;
}

const schema = z
  .object({
    name: z.string().trim().min(1, "Name ist ein Pflichtfeld."),
    lat: z.string(),
    lng: z.string(),
    motivIds: z.array(z.string()),
    beobachtungen: z.string(),
    besteZeit: z.string(),
    tags: z.array(z.string()),
    bildUrl: z
      .string()
      .refine((v) => v.trim() === "" || isSafeHttpUrl(v.trim()), {
        message: "Bitte eine vollständige http(s)-Adresse angeben.",
      }),
  })
  .superRefine((val, ctx) => {
    const latSet = val.lat.trim() !== "";
    const lngSet = val.lng.trim() !== "";
    if (latSet !== lngSet) {
      ctx.addIssue({
        path: [latSet ? "lng" : "lat"],
        code: "custom",
        message: "Bitte Breite und Länge zusammen angeben.",
      });
    }
    if (latSet) {
      const n = parseCoord(val.lat);
      if (n === null || !isValidLat(n))
        ctx.addIssue({
          path: ["lat"],
          code: "custom",
          message: "Breitengrad muss zwischen −90 und 90 liegen.",
        });
    }
    if (lngSet) {
      const n = parseCoord(val.lng);
      if (n === null || !isValidLng(n))
        ctx.addIssue({
          path: ["lng"],
          code: "custom",
          message: "Längengrad muss zwischen −180 und 180 liegen.",
        });
    }
  });

type FormValues = z.infer<typeof schema>;

function emptyValues(): FormValues {
  return {
    name: "",
    lat: "",
    lng: "",
    motivIds: [],
    beobachtungen: "",
    besteZeit: "",
    tags: [],
    bildUrl: "",
  };
}

function spotToValues(s: Fotospot): FormValues {
  return {
    name: s.name,
    lat: s.lat?.toString() ?? "",
    lng: s.lng?.toString() ?? "",
    motivIds: [...s.motivIds],
    beobachtungen: s.beobachtungen ?? "",
    besteZeit: s.besteZeit ?? "",
    tags: [...s.tags],
    bildUrl: s.bildUrl ?? "",
  };
}

const clean = (s: string) => {
  const t = s.trim();
  return t.length > 0 ? t : undefined;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot?: Fotospot;
  motive: Motiv[];
  onSubmit: (input: FotospotInput) => void;
}

export function FotospotFormDialog({
  open,
  onOpenChange,
  spot,
  motive,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (open) form.reset(spot ? spotToValues(spot) : emptyValues());
  }, [open, spot, form]);

  const handleSubmit = form.handleSubmit((values) => {
    const lat = parseCoord(values.lat);
    const lng = parseCoord(values.lng);
    onSubmit({
      name: values.name.trim(),
      lat: lat !== null && !Number.isNaN(lat) ? lat : undefined,
      lng: lng !== null && !Number.isNaN(lng) ? lng : undefined,
      motivIds: values.motivIds,
      beobachtungen: clean(values.beobachtungen),
      besteZeit: clean(values.besteZeit),
      tags: values.tags,
      bildUrl: sanitizeUrl(values.bildUrl),
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {spot ? "Fotospot bearbeiten" : "Neuer Fotospot"}
          </DialogTitle>
          <DialogDescription>
            Nur der Name ist Pflicht. GPS, Motive und Notizen sind optional.
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
                    <Input placeholder="z. B. Auwald am Flussbogen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breite (lat)</FormLabel>
                    <FormControl>
                      <Input placeholder="48.1371" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Länge (lng)</FormLabel>
                    <FormControl>
                      <Input placeholder="11.5754" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verknüpfte Motive</FormLabel>
                  <MotivMultiSelect
                    motive={motive}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beobachtungen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beobachtungen &amp; Fotoideen</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Zugang, beste Tageszeit, Ideen…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="besteZeit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beste Zeit</FormLabel>
                  <FormControl>
                    <Input placeholder="z. B. Mai–Juni, früh morgens" {...field} />
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

            <FormField
              control={form.control}
              name="bildUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bild-Link (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://…" {...field} />
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
