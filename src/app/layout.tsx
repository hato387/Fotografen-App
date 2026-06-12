import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { PageTitle } from "@/components/page-title";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Naturfoto — Motive, Saison & Spots",
  description:
    "Persönliche Wissens- und Planungs-App für die Naturfotografie. Lokal, offline, in eigener Hand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageTitle />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-1 h-4" />
                <span className="font-semibold md:hidden">🌲 Naturfoto</span>
                <div className="flex-1" />
                <ThemeToggle />
              </header>
              <main className="flex-1 px-4 py-6 md:px-8">
                <div className="mx-auto w-full max-w-5xl">{children}</div>
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
