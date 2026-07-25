import type { Brand } from "@/generated/prisma/client";

export function BrandMarquee({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  const doubled = [...brands, ...brands];

  return (
    <section className="border-y border-jetta-metal/15 bg-jetta-graphite/30 py-10">
      <p className="mb-6 text-center text-xs font-semibold tracking-wide text-jetta-metal uppercase">
        As marcas que movem o seu estilo
      </p>
      <div className="group overflow-hidden">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-16 group-hover:[animation-play-state:paused]">
          {doubled.map((brand, index) => (
            <span
              key={`${brand.id}-${index}`}
              className="font-display text-lg font-bold tracking-widest text-jetta-metal uppercase"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_30s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </section>
  );
}
