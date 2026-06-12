"use client";

import {
  ArrowRight,
  CalendarRange,
  Camera,
  LayoutDashboard,
  Leaf,
  MapPin,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { KategorieBadge } from "@/components/motive/kategorie-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFotospots } from "@/hooks/use-fotospots";
import { useMotive } from "@/hooks/use-motive";
import { useSaisonphasen } from "@/hooks/use-saisonphasen";
import { getCurrentKW, kwSpanne, kwToMonat } from "@/lib/kw";
import { isActiveInKW, isUpcoming, weeksUntilStart } from "@/lib/saison";
import type { Motiv, Saisonphase } from "@/lib/types";

interface Eintrag {
  motiv: Motiv;
  phase: Saisonphase;
}

export default function DashboardPage() {
  const motive = useMotive();
  const saison = useSaisonphasen();
  const spots = useFotospots();

  const loaded = motive.loaded && saison.loaded && spots.loaded;
  const kw = getCurrentKW();

  const { aktiv, bevorstehend } = useMemo(() => {
    const byId = new Map(motive.items.map((m) => [m.id, m]));
    const aktiv: Eintrag[] = [];
    const bevorstehend: Eintrag[] = [];
    for (const p of saison.items) {
      const m = byId.get(p.motivId);
      if (!m) continue;
      if (isActiveInKW(p, kw)) aktiv.push({ motiv: m, phase: p });
      else if (isUpcoming(p, kw, 4)) bevorstehend.push({ motiv: m, phase: p });
    }
    bevorstehend.sort(
      (a, b) =>
        weeksUntilStart(a.phase.startKW, kw) -
        weeksUntilStart(b.phase.startKW, kw),
    );
    return { aktiv, bevorstehend };
  }, [motive.items, saison.items, kw]);

  if (!loaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Übersicht"
        description={`Kalenderwoche ${kw} · ≈ ${kwToMonat(kw)}`}
        actions={
          <Button asChild className="rounded-full">
            <Link href="/motive">
              <Plus className="mr-1 h-4 w-4" /> Neues Motiv
            </Link>
          </Button>
        }
      />

      {motive.items.length === 0 ? (
        <Onboarding />
      ) : (
        <>
          {/* Kennzahlen */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              href="/motive"
              icon={Leaf}
              label="Motive"
              value={motive.items.length}
            />
            <StatCard
              href="/kalender"
              icon={CalendarRange}
              label="Aktiv diese Woche"
              value={aktiv.length}
            />
            <StatCard
              href="/kalender"
              icon={Star}
              label="Bevorstehend (4 Wo.)"
              value={bevorstehend.length}
            />
            <StatCard
              href="/fotospots"
              icon={MapPin}
              label="Fotospots"
              value={spots.items.length}
            />
          </div>

          {/* Listen */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ListCard
              title={`Jetzt aktiv (KW ${kw})`}
              leer="Diese Woche ist keine Saisonphase aktiv."
              eintraege={aktiv.slice(0, 6)}
            />
            <ListCard
              title="Bald interessant"
              leer="In den nächsten 4 Wochen beginnt keine Phase."
              eintraege={bevorstehend.slice(0, 6)}
              hint={(p) => `in ${weeksUntilStart(p.startKW, kw)} Wo.`}
            />
          </div>

          <div className="flex justify-end">
            <Button asChild variant="ghost" size="sm">
              <Link href="/kalender">
                Zum Saison-Kalender <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: typeof Leaf;
  label: string;
  value: number;
}) {
  return (
    <Link href={href} className="group">
      <Card className="flex items-center gap-3 rounded-xl border-border/70 p-4 transition-colors hover:bg-accent/40">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-semibold leading-none">{value}</div>
          <div className="truncate text-xs text-muted-foreground">{label}</div>
        </div>
      </Card>
    </Link>
  );
}

function ListCard({
  title,
  leer,
  eintraege,
  hint,
}: {
  title: string;
  leer: string;
  eintraege: Eintrag[];
  hint?: (p: Saisonphase) => string;
}) {
  return (
    <Card className="rounded-xl border-border/70 p-5">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {eintraege.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{leer}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {eintraege.map(({ motiv, phase }) => (
            <li key={phase.id}>
              <Link
                href={`/motive/${motiv.id}`}
                className="flex items-center justify-between gap-3 py-2.5 hover:bg-accent/30"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="truncate">{motiv.name}</span>
                    {phase.hoehepunkt && (
                      <Star className="h-3.5 w-3.5 shrink-0 fill-current text-amber-500" />
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {phase.bezeichnung || "Aktive Zeit"} ·{" "}
                    {kwSpanne(phase.startKW, phase.endKW)}
                    {hint && ` · ${hint(phase)}`}
                  </div>
                </div>
                <KategorieBadge
                  kategorie={motiv.kategorie}
                  className="shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Onboarding() {
  const schritte = [
    {
      icon: Leaf,
      titel: "1 · Motiv anlegen",
      text: "Lege deine erste Art oder Landschaft an — z. B. „Eisvogel“.",
      href: "/motive",
      cta: "Zu den Motiven",
    },
    {
      icon: Sparkles,
      titel: "2 · Mit KI befüllen",
      text: "Lass Beschreibung, Fototipps und Saisonphasen per KI ausfüllen.",
      href: "/ki-import",
      cta: "KI-Import öffnen",
    },
    {
      icon: CalendarRange,
      titel: "3 · Saison planen",
      text: "Der Kalender zeigt dir, was sich wann lohnt — Woche und Jahr.",
      href: "/kalender",
      cta: "Kalender ansehen",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-dashed p-6 text-center">
        <h2 className="text-lg font-semibold">Willkommen bei Naturfoto 🌲</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Deine persönliche Wissens- und Planungs-App für die Naturfotografie —
          vollständig offline, alle Daten bleiben bei dir.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {schritte.map((s) => (
          <Card key={s.titel} className="flex flex-col gap-3 rounded-xl p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{s.titel}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href={s.href}>
                {s.cta} <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>
      <Card className="flex items-center gap-3 rounded-xl bg-accent/40 p-4 text-sm text-muted-foreground">
        <Camera className="h-4 w-4 shrink-0 text-primary" />
        Tipp: Unter „Fotoeinstellungen“ sammelst du bewährte Kamera-Rezepte wie
        „Vogel im Flug“ — unabhängig von Motiven.
      </Card>
    </div>
  );
}
