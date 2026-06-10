import { Badge } from "@/components/ui/badge";
import { KONFIDENZ_META } from "@/lib/konfidenz";
import { Konfidenz } from "@/lib/types";
import { cn } from "@/lib/utils";

export function KonfidenzBadge({
  konfidenz,
  className,
}: {
  konfidenz: Konfidenz;
  className?: string;
}) {
  const meta = KONFIDENZ_META[konfidenz];
  return (
    <Badge className={cn("font-normal", meta.badgeClass, className)}>
      {meta.label}
    </Badge>
  );
}
