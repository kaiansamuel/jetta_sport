import { cn } from "@/lib/utils/cn";

export function ColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: string[];
  selected: string | null;
  onSelect: (color: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold tracking-wide text-jetta-metal uppercase">
        Cor
      </legend>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-pressed={selected === color}
            onClick={() => onSelect(color)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              selected === color
                ? "border-jetta-blue bg-jetta-blue/15 text-jetta-cyan"
                : "border-jetta-metal/30 text-jetta-ice hover:border-jetta-blue",
            )}
          >
            {color}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
