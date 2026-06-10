"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";

/** Einfaches Tag-Eingabefeld: Enter oder Komma fügt hinzu, Klick entfernt. */
export function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-2">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 font-normal">
          {tag}
          <button
            type="button"
            aria-label={`Tag ${tag} entfernen`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? "Tag eingeben, Enter…" : ""}
        className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
