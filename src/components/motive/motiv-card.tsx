"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KategorieBadge } from "@/components/motive/kategorie-badge";
import { KATEGORIE_META } from "@/lib/kategorie";
import { Motiv } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MotivCard({ motiv }: { motiv: Motiv }) {
  const [imgError, setImgError] = useState(false);
  const meta = KATEGORIE_META[motiv.kategorie];
  const showImage = motiv.bildUrl && !imgError;

  return (
    <Link href={`/motive/${motiv.id}`} className="group block">
      <Card className="h-full overflow-hidden rounded-2xl border-border/60 p-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[16/10] overflow-hidden">
          {showImage ? (
            // Externe Bild-URLs: bewusst <img> (beliebige Hosts), kein next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={motiv.bildUrl}
              alt={motiv.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br",
                meta.gradientClass,
              )}
            >
              <span className="text-5xl opacity-80 transition-transform duration-300 group-hover:scale-110">
                {meta.icon}
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <KategorieBadge
              kategorie={motiv.kategorie}
              className="shadow-sm backdrop-blur"
            />
          </div>
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 font-semibold leading-tight tracking-tight">
            {motiv.name}
          </h3>

          {motiv.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {motiv.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-normal text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
              {motiv.tags.length > 3 && (
                <Badge variant="secondary" className="font-normal">
                  +{motiv.tags.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {motiv.beschreibung || "Noch keine Beschreibung."}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
