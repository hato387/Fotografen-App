"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Kanonisches next-themes-Muster: erst nach dem Mount das echte Theme
  // rendern (Server kennt es nicht). Der setState-im-Effect ist hier gewollt.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Vor dem Mount kennt der Client das echte Theme noch nicht — bis dahin
  // denselben Zustand wie der Server annehmen (verhindert Hydration-Mismatch).
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
