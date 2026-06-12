"use client";

import {
  CalendarRange,
  Camera,
  LayoutDashboard,
  Leaf,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const GRUPPEN = [
  {
    label: "Planung",
    items: [
      { label: "Übersicht", href: "/", icon: LayoutDashboard, exact: true },
      { label: "Saison-Kalender", href: "/kalender", icon: CalendarRange },
    ],
  },
  {
    label: "Sammlung",
    items: [
      { label: "Motive", href: "/motive", icon: Leaf },
      { label: "Fotospots", href: "/fotospots", icon: MapPin },
      { label: "Fotoeinstellungen", href: "/fotoeinstellungen", icon: Camera },
    ],
  },
  {
    label: "Werkzeuge",
    items: [
      { label: "KI-Import", href: "/ki-import", icon: Sparkles },
      { label: "Backup & Import", href: "/backup", icon: Save },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-base text-primary-foreground">
                  🌲
                </span>
                <span className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Naturfoto</span>
                  <span className="text-xs text-muted-foreground">
                    lokal · offline
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {GRUPPEN.map((gruppe) => (
          <SidebarGroup key={gruppe.label}>
            <SidebarGroupLabel>{gruppe.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {gruppe.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href, item.exact)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 pb-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Alle Daten bleiben auf diesem Gerät.
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
