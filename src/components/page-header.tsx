import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Optionale Anzahl (z. B. Einträge) als Badge neben dem Titel. */
  count?: number;
  /** Aktionen rechts (z. B. „Neu anlegen"-Button). */
  actions?: ReactNode;
}

/** Einheitlicher Seitenkopf: Icon-Kachel, Titel, Beschreibung, Aktionen. */
export function PageHeader({
  icon: Icon,
  title,
  description,
  count,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
            {typeof count === "number" && count > 0 && (
              <Badge variant="secondary" className="rounded-full font-normal">
                {count}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
