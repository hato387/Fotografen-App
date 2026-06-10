"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Motiv } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  motive: Motiv[];
  value: string[];
  onChange: (ids: string[]) => void;
}

export function MotivMultiSelect({ motive, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selected = motive.filter((m) => value.includes(m.id));

  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value.length > 0
              ? `${value.length} Motiv${value.length === 1 ? "" : "e"} verknüpft`
              : "Motive verknüpfen…"}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Motiv suchen…" />
            <CommandList>
              <CommandEmpty>Keine Motive gefunden.</CommandEmpty>
              <CommandGroup>
                {motive.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={m.name}
                    onSelect={() => toggle(m.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(m.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {m.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((m) => (
            <Badge key={m.id} variant="secondary" className="font-normal">
              {m.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
