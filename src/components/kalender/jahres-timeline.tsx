"use client";

import Link from "next/link";
import type { KalenderRow } from "@/components/kalender/wochen-ansicht";
import { KATEGORIE_META } from "@/lib/kategorie";
import { kwSpanne, kwToMonat, MAX_KW } from "@/lib/kw";
import { Saisonphase } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  rows: KalenderRow[];
  currentKW: number;
}

interface Segment {
  left: number;
  width: number;
}

/** Zerlegt eine Phase in 1–2 Balken-Segmente (Jahresübergang = 2). */
function segments(p: Saisonphase): Segment[] {
  const pct = (weeks: number) => (weeks / MAX_KW) * 100;
  if (p.startKW <= p.endKW) {
    return [
      { left: pct(p.startKW - 1), width: pct(p.endKW - p.startKW + 1) },
    ];
  }
  return [
    { left: pct(p.startKW - 1), width: pct(MAX_KW - p.startKW + 1) },
    { left: 0, width: pct(p.endKW) },
  ];
}

function monthTicks() {
  const ticks: { label: string; left: number }[] = [];
  let prev = "";
  for (let w = 1; w <= MAX_KW; w++) {
    const m = kwToMonat(w);
    if (m !== prev) {
      ticks.push({ label: m, left: ((w - 1) / MAX_KW) * 100 });
      prev = m;
    }
  }
  return ticks;
}

export function JahresTimeline({ rows, currentKW }: Props) {
  const ticks = monthTicks();
  const todayLeft = ((currentKW - 0.5) / MAX_KW) * 100;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px] space-y-1.5">
        {/* Monats-Kopf */}
        <div className="flex">
          <div className="w-36 shrink-0" />
          <div className="relative h-5 flex-1">
            {ticks.map((t) => (
              <span
                key={t.label}
                className="absolute text-[11px] text-muted-foreground"
                style={{ left: `${t.left}%` }}
              >
                {t.label}
              </span>
            ))}
            <div
              className="absolute -bottom-1 top-0 w-px bg-primary/60"
              style={{ left: `${todayLeft}%` }}
              title={`Heute · KW ${currentKW}`}
            />
          </div>
        </div>

        {/* Motiv-Zeilen */}
        {rows.map(({ motiv, phasen }) => {
          const meta = KATEGORIE_META[motiv.kategorie];
          return (
            <div key={motiv.id} className="flex items-center">
              <Link
                href={`/motive/${motiv.id}`}
                className="w-36 shrink-0 truncate pr-2 text-sm hover:underline"
                title={motiv.name}
              >
                {motiv.name}
              </Link>
              <div className="relative h-7 flex-1 rounded bg-muted/40">
                {/* Heute-Markierung */}
                <div
                  className="absolute inset-y-0 z-10 w-px bg-primary/60"
                  style={{ left: `${todayLeft}%` }}
                />
                {phasen.map((p) =>
                  segments(p).map((s, i) => (
                    <Link
                      key={`${p.id}-${i}`}
                      href={`/motive/${motiv.id}`}
                      title={`${p.bezeichnung || "Aktive Zeit"} · ${kwSpanne(p.startKW, p.endKW)} · ${p.konfidenz}`}
                      className={cn(
                        "absolute inset-y-1 flex items-center justify-center rounded",
                        meta.barClass,
                        p.konfidenz === "niedrig" && "opacity-50",
                        p.hoehepunkt && "ring-2 ring-amber-400 ring-offset-1",
                      )}
                      style={{ left: `${s.left}%`, width: `${s.width}%` }}
                    >
                      {p.hoehepunkt && s.width > 6 && (
                        <span className="text-[10px] leading-none">★</span>
                      )}
                    </Link>
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
