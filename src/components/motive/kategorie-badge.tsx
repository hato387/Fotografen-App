import { Badge } from "@/components/ui/badge";
import { KATEGORIE_META } from "@/lib/kategorie";
import { Kategorie } from "@/lib/types";
import { cn } from "@/lib/utils";

export function KategorieBadge({
  kategorie,
  className,
}: {
  kategorie: Kategorie;
  className?: string;
}) {
  const meta = KATEGORIE_META[kategorie];
  return (
    <Badge className={cn(meta.badgeClass, className)}>
      <span className="mr-1" aria-hidden>
        {meta.icon}
      </span>
      {meta.label}
    </Badge>
  );
}
