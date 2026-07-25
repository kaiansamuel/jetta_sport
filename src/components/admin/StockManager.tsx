"use client";

import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface VariantRow {
  id?: string;
  color: string;
  size: string;
  stock: number;
}

export function StockManager({
  variants,
  onChange,
}: {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}) {
  const updateRow = (index: number, patch: Partial<VariantRow>) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const removeRow = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...variants, { color: "", size: "", stock: 0 }]);
  };

  const duplicateKeys = findDuplicateKeys(variants);

  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_100px_40px] gap-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
        <span>Cor</span>
        <span>Numeração</span>
        <span>Estoque</span>
        <span />
      </div>

      <div className="mt-2 space-y-2">
        {variants.map((variant, index) => {
          const key = `${variant.color}::${variant.size}`;
          const isDuplicate = variant.color && variant.size && duplicateKeys.has(key);
          return (
            <div key={index} className="grid grid-cols-[1fr_1fr_100px_40px] items-center gap-2">
              <Input
                value={variant.color}
                onChange={(e) => updateRow(index, { color: e.target.value })}
                placeholder="Preto"
                error={isDuplicate ? "Combinação duplicada" : undefined}
              />
              <Input
                value={variant.size}
                onChange={(e) => updateRow(index, { size: e.target.value })}
                placeholder="40"
                error={isDuplicate ? " " : undefined}
              />
              <Input
                type="number"
                min={0}
                value={variant.stock}
                onChange={(e) => updateRow(index, { stock: Number(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label="Remover variante"
                className="flex h-9 w-9 items-center justify-center text-jetta-metal hover:text-jetta-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {duplicateKeys.size > 0 && (
        <p className="mt-2 text-xs text-jetta-red-text">
          Existem combinações de cor + numeração repetidas.
        </p>
      )}

      <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={addRow}>
        <Plus className="h-4 w-4" />
        Adicionar variante
      </Button>
    </div>
  );
}

function findDuplicateKeys(variants: VariantRow[]) {
  const seen = new Map<string, number>();
  for (const v of variants) {
    if (!v.color || !v.size) continue;
    const key = `${v.color}::${v.size}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return new Set([...seen.entries()].filter(([, count]) => count > 1).map(([key]) => key));
}
