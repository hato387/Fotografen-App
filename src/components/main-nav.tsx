"use client";

import {
  CalendarRange,
  Camera,
  Database,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavItem {
  label: string;
  href: string;
  icon: typeof Database;
  /** Noch nicht gebaute Bereiche werden deaktiviert angezeigt. */
  ready: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Motive", href: "/motive", icon: Database, ready: true },
  { label: "Kalender", href: "/kalender", icon: CalendarRange, ready: false },
  { label: "Fotospots", href: "/fotospots", icon: MapPin, ready: false },
  { label: "Einstellungen", href: "/fotoeinstellungen", icon: Camera, ready: false },
  { label: "Backup", href: "/backup", icon: Save, ready: false },
  { label: "KI-Import", href: "/ki-import", icon: Sparkles, ready: false },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/motive" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">🌲</span>
          <span className="hidden sm:inline">Naturfoto</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              item.ready &&
              (pathname === item.href || pathname.startsWith(item.href + "/"));
            const Icon = item.icon;

            if (!item.ready) {
              return (
                <span
                  key={item.href}
                  title="Bald verfügbar"
                  className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground/50"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/70 hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
