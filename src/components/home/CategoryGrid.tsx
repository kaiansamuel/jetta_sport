"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/generated/prisma/client";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const track = useTrackEvent();

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-2xl font-bold text-jetta-ice">Categorias</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalogo?categoria=${category.slug}`}
            onClick={() => track("category_click", { categorySlug: category.slug })}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-jetta-metal/15 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(24,191,255,0.3)]"
          >
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-jetta-black/90 via-jetta-black/20 to-transparent transition-colors group-hover:from-jetta-black/95" />
            {/* Light sweep — PRD §7.3 "brilho lateral" */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <div className="absolute inset-x-0 bottom-0 border-b-2 border-transparent p-4 transition-colors group-hover:border-jetta-blue">
              <span className="font-display text-sm font-bold tracking-wide text-jetta-ice uppercase transition-transform group-hover:translate-x-1">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
