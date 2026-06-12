"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  KalenderFilter,
  KonfidenzFilter,
  StatusFilter,
} from "@/lib/kalender";
import { KATEGORIEN } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  filter: KalenderFilter;
  onChange: (next: KalenderFilter) => void;
  availableTags: string[];
}

export function KalenderFilterBar({ filter, onChange, availableTags }: Props) {
  const set = (patch: Partial<KalenderFilter>) =>
    onChange({ ...filter, ...patch });

  const toggleTag = (tag: string) =>
    set({
      tags: filter.tags.includes(tag)
        ? filter.tags.filter((t) => t !== tag)
        : [...filter.tags, tag],
    });

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filter.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="Motiv suchen…"
            className="rounded-full border-border/60 bg-background pl-9"
          />
        </div>

        <Select
          value={filter.status}
          onValueChange={(v) => set({ status: v as StatusFilter })}
        >
          <SelectTrigger className="w-[150px]" aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Zeiträume</SelectItem>
            <SelectItem value="aktiv">Aktiv jetzt</SelectItem>
            <SelectItem value="bevorstehend">Bevorstehend</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.konfidenz}
          onValueChange={(v) => set({ konfidenz: v as KonfidenzFilter })}
        >
          <SelectTrigger className="w-[150px]" aria-label="Konfidenz">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Konfidenz</SelectItem>
            <SelectItem value="mittel">mind. mittel</SelectItem>
            <SelectItem value="hoch">nur hoch</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.kategorie}
          onValueChange={(v) =>
            set({ kategorie: v as KalenderFilter["kategorie"] })
          }
        >
          <SelectTrigger className="w-[160px]" aria-label="Kategorie">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle Kategorien</SelectItem>
            {KATEGORIEN.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5">
          <Switch
            id="hoehepunkt-filter"
            checked={filter.hoehepunktOnly}
            onCheckedChange={(v) => set({ hoehepunktOnly: v })}
          />
          <Label htmlFor="hoehepunkt-filter" className="cursor-pointer text-sm">
            Nur Höhepunkte
          </Label>
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Tags:</span>
          {availableTags.map((tag) => {
            const active = filter.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
              >
                <Badge
                  variant={active ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer font-normal",
                    !active && "text-muted-foreground",
                  )}
                >
                  {tag}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
