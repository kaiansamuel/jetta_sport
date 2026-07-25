import { cn } from "@/lib/utils/cn";

export function SizeSelector({
  sizes,
  selected,
  disabledSizes,
  onSelect,
}: {
  sizes: string[];
  selected: string | null;
  disabledSizes: Set<string>;
  onSelect: (size: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
        Numeração
      </legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const disabled = disabledSizes.has(size);
          return (
            <button
              key={size}
              type="button"
              disabled={disabled}
              aria-pressed={selected === size}
              onClick={() => onSelect(size)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg border text-sm transition-colors",
                disabled
                  ? "cursor-not-allowed border-jetta-metal/10 text-jetta-metal/40 line-through"
                  : selected === size
                    ? "border-jetta-blue bg-jetta-blue/15 text-jetta-cyan"
                    : "border-jetta-metal/30 text-jetta-ice hover:border-jetta-blue",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
