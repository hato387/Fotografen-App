"use client";

import { ImageOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KategorieBadge } from "@/components/motive/kategorie-badge";
import { Motiv } from "@/lib/types";

export function MotivCard({ motiv }: { motiv: Motiv }) {
  const [imgError, setImgError] = useState(false);
  const showImage = motiv.bildUrl && !imgError;

  return (
    <Link href={`/motive/${motiv.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-muted">
          {showImage ? (
            // Externe Bild-URLs: kein next/image (beliebige Hosts), bewusst <img>.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={motiv.bildUrl}
              alt={motiv.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImageOff className="h-8 w-8 text-muted-foreground/40" aria-hidden />
          )}
        </div>

        <CardHeader className="gap-2 space-y-0 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold leading-tight">
              {motiv.name}
            </h3>
            <KategorieBadge kategorie={motiv.kategorie} className="shrink-0" />
          </div>
        </CardHeader>

        <CardContent>
          {motiv.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {motiv.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
              {motiv.tags.length > 4 && (
                <Badge variant="secondary" className="font-normal">
                  +{motiv.tags.length - 4}
                </Badge>
              )}
            </div>
          ) : (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {motiv.beschreibung || "Keine Beschreibung"}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
