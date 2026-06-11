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
  { label: "Kalender", href: "/kalender", icon: CalendarRange, ready: true },
  { label: "Fotospots", href: "/fotospots", icon: MapPin, ready: true },
  { label: "Einstellungen", href: "/fotoeinstellungen", icon: Camera, ready: true },
  { label: "Backup", href: "/backup", icon: Save, ready: true },
  { label: "KI-Import", href: "/ki-import", icon: Sparkles, ready: true },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/motive" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base shadow-sm">
            🌲
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-semibold tracking-tight">Naturfoto</span>
            <span className="text-[11px] text-muted-foreground">
              lokal · offline
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-0.5 overflow-x-auto">
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
                  className="flex cursor-not-allowed items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground/40"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
