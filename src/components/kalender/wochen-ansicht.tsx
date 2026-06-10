"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { KategorieBadge } from "@/components/motive/kategorie-badge";
import { KonfidenzBadge } from "@/components/saisonphasen/konfidenz-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentKW, kwSpanne, kwToMonat, MAX_KW } from "@/lib/kw";
import { isActiveInKW, isUpcoming, weeksUntilStart } from "@/lib/saison";
import { Motiv, Saisonphase } from "@/lib/types";

export interface KalenderRow {
  motiv: Motiv;
  phasen: Saisonphase[];
}

interface Props {
  rows: KalenderRow[];
  currentKW: number;
  onKwChange: (kw: number) => void;
}

function wrap(kw: number): number {
  return ((kw - 1 + MAX_KW) % MAX_KW) + 1;
}

export function WochenAnsicht({ rows, currentKW, onKwChange }: Props) {
  const aktiv = rows
    .map((r) => ({
      motiv: r.motiv,
      phasen: r.phasen.filter((p) => isActiveInKW(p, currentKW)),
    }))
    .filter((r) => r.phasen.length > 0);

  const bevorstehend = rows
    .map((r) => ({
      motiv: r.motiv,
      phasen: r.phasen.filter((p) => isUpcoming(p, currentKW, 4)),
    }))
    .filter((r) => r.phasen.length > 0);

  return (
    <div className="space-y-6">
      {/* KW-Navigator */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Vorherige Woche"
          onClick={() => onKwChange(wrap(currentKW - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[9rem] text-center">
          <div className="font-semibold">KW {currentKW}</div>
          <div className="text-xs text-muted-foreground">
            ≈ {kwToMonat(currentKW)}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Nächste Woche"
          onClick={() => onKwChange(wrap(currentKW + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onKwChange(getCurrentKW())}
        >
          Heute
        </Button>
      </div>

      {/* Aktiv jetzt */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Aktiv in KW {currentKW} ({aktiv.length})
        </h3>
        {aktiv.length === 0 ? (
          <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
            In dieser Woche ist kein Motiv aktiv.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {aktiv.map((r) => (
              <MotivPhaseCard key={r.motiv.id} {...r} />
            ))}
          </div>
        )}
      </section>

      {/* Bevorstehend */}
      {bevorstehend.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Bevorstehend (nächste 4 Wochen)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {bevorstehend.map((r) => (
              <MotivPhaseCard
                key={r.motiv.id}
                {...r}
                hint={(p) =>
                  `beginnt in ${weeksUntilStart(p.startKW, currentKW)} Wo. (KW ${p.startKW})`
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MotivPhaseCard({
  motiv,
  phasen,
  hint,
}: KalenderRow & { hint?: (p: Saisonphase) => string }) {
  return (
    <Card className="rounded-2xl border-border/60 p-4">
      <Link
        href={`/motive/${motiv.id}`}
        className="flex items-center justify-between gap-2 hover:underline"
      >
        <span className="font-semibold">{motiv.name}</span>
        <KategorieBadge kategorie={motiv.kategorie} />
      </Link>
      <ul className="mt-2 space-y-1.5">
        {phasen.map((p) => (
          <li key={p.id} className="text-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-medium">
                {p.bezeichnung || "Aktive Zeit"}
              </span>
              {p.hoehepunkt && (
                <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              )}
              <KonfidenzBadge konfidenz={p.konfidenz} />
            </div>
            <div className="text-muted-foreground">
              {kwSpanne(p.startKW, p.endKW)}
              {p.region && ` · ${p.region}`}
              {hint && ` · ${hint(p)}`}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
