"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export interface FilterOptions {
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  colors: string[];
  sizes: string[];
}

export function ProductFilters({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const track = useTrackEvent();

  const [priceMin, setPriceMin] = useState(searchParams.get("precoMin") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("precoMax") ?? "");

  const currentCategory = searchParams.get("categoria");
  const currentBrand = searchParams.get("marca");
  const currentColors = (searchParams.get("cor") ?? "").split(",").filter(Boolean);
  const currentSizes = (searchParams.get("tamanho") ?? "").split(",").filter(Boolean);
  const isNew = searchParams.get("novo") === "1";
  const isPromotion = searchParams.get("promocao") === "1";
  const inStock = searchParams.get("disponivel") === "1";

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("pagina");
      track("filter_applied", Object.fromEntries(params.entries()));
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams, track],
  );

  const toggleSingle = (key: string, value: string) => {
    pushParams((params) => {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
  };

  const toggleMulti = (key: string, value: string, current: string[]) => {
    pushParams((params) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length) {
        params.set(key, next.join(","));
      } else {
        params.delete(key);
      }
    });
  };

  const toggleBoolean = (key: string) => {
    pushParams((params) => {
      if (params.get(key) === "1") {
        params.delete(key);
      } else {
        params.set(key, "1");
      }
    });
  };

  const applyPriceRange = () => {
    pushParams((params) => {
      if (priceMin) params.set("precoMin", priceMin);
      else params.delete("precoMin");
      if (priceMax) params.set("precoMax", priceMax);
      else params.delete("precoMax");
    });
  };

  const clearAll = () => {
    setPriceMin("");
    setPriceMax("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-wide text-jetta-ice uppercase">
          Filtros
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-jetta-metal hover:text-jetta-blue"
        >
          Limpar
        </button>
      </div>

      {options.categories.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
            Categoria
          </legend>
          <div className="flex flex-wrap gap-2">
            {options.categories.map((category) => (
              <FilterChip
                key={category.slug}
                active={currentCategory === category.slug}
                onClick={() => toggleSingle("categoria", category.slug)}
              >
                {category.name}
              </FilterChip>
            ))}
          </div>
        </fieldset>
      )}

      {options.brands.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
            Marca
          </legend>
          <div className="flex flex-wrap gap-2">
            {options.brands.map((brand) => (
              <FilterChip
                key={brand.slug}
                active={currentBrand === brand.slug}
                onClick={() => toggleSingle("marca", brand.slug)}
              >
                {brand.name}
              </FilterChip>
            ))}
          </div>
        </fieldset>
      )}

      {options.sizes.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
            Numeração
          </legend>
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((size) => (
              <FilterChip
                key={size}
                active={currentSizes.includes(size)}
                onClick={() => toggleMulti("tamanho", size, currentSizes)}
              >
                {size}
              </FilterChip>
            ))}
          </div>
        </fieldset>
      )}

      {options.colors.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
            Cor
          </legend>
          <div className="flex flex-wrap gap-2">
            {options.colors.map((color) => (
              <FilterChip
                key={color}
                active={currentColors.includes(color)}
                onClick={() => toggleMulti("cor", color, currentColors)}
              >
                {color}
              </FilterChip>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
          Faixa de preço
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Mín."
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-10 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice placeholder:text-jetta-metal"
          />
          <span className="text-jetta-metal">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Máx."
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-10 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice placeholder:text-jetta-metal"
          />
        </div>
        <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={applyPriceRange}>
          Aplicar
        </Button>
      </fieldset>

      <fieldset className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-jetta-ice">
          <input
            type="checkbox"
            checked={isNew}
            onChange={() => toggleBoolean("novo")}
            className="h-4 w-4 accent-jetta-blue"
          />
          Lançamentos
        </label>
        <label className="flex items-center gap-2 text-sm text-jetta-ice">
          <input
            type="checkbox"
            checked={isPromotion}
            onChange={() => toggleBoolean("promocao")}
            className="h-4 w-4 accent-jetta-blue"
          />
          Promoção
        </label>
        <label className="flex items-center gap-2 text-sm text-jetta-ice">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => toggleBoolean("disponivel")}
            className="h-4 w-4 accent-jetta-blue"
          />
          Disponível
        </label>
      </fieldset>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-jetta-blue bg-jetta-blue/15 text-jetta-cyan"
          : "border-jetta-metal/30 text-jetta-metal hover:border-jetta-blue hover:text-jetta-blue",
      )}
    >
      {children}
    </button>
  );
}
