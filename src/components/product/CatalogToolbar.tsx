"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/validators/catalog";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export function CatalogToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const track = useTrackEvent();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("pagina");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("q", query);
          if (query) track("search", { q: query });
        }}
        className="relative flex-1 sm:max-w-sm"
      >
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-jetta-metal" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produtos..."
          aria-label="Buscar produtos"
          className="h-11 w-full rounded-full border border-jetta-metal/30 bg-jetta-graphite pl-10 pr-4 text-sm text-jetta-ice placeholder:text-jetta-metal focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        />
      </form>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-sm text-jetta-metal">{total} produtos</p>
        <select
          aria-label="Ordenar por"
          value={searchParams.get("ordenar") ?? "recente"}
          onChange={(e) => updateParam("ordenar", e.target.value)}
          className="h-11 rounded-full border border-jetta-metal/30 bg-jetta-graphite px-4 text-sm text-jetta-ice focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
