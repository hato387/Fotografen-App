"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hasCoords } from "@/lib/geo";
import { Fotospot } from "@/lib/types";

export function FotospotCard({
  spot,
  motivNames,
}: {
  spot: Fotospot;
  motivNames: string[];
}) {
  return (
    <Link href={`/fotospots/${spot.id}`} className="group block">
      <Card className="h-full space-y-2 rounded-2xl border-border/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{spot.name}</h3>
          {hasCoords(spot) && (
            <MapPin
              className="h-4 w-4 shrink-0 text-primary"
              aria-label="hat GPS-Koordinaten"
            />
          )}
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {spot.beobachtungen || "Keine Notizen."}
        </p>

        {motivNames.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {motivNames.slice(0, 3).map((n) => (
              <Badge key={n} variant="secondary" className="font-normal">
                {n}
              </Badge>
            ))}
            {motivNames.length > 3 && (
              <Badge variant="secondary" className="font-normal">
                +{motivNames.length - 3}
              </Badge>
            )}
          </div>
        )}

        {spot.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {spot.tags.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="font-normal text-muted-foreground"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
