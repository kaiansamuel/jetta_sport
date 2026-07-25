"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductListItem } from "@/lib/db/products";

export function LaunchesCarousel({
  products,
  whatsappNumber,
}: {
  products: ProductListItem[];
  whatsappNumber: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  if (products.length === 0) return null;

  return (
    <section className="bg-jetta-graphite/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-jetta-blue-text uppercase">
              Novos modelos. Nova energia.
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-jetta-ice">
              Lançamentos
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/lancamentos"
              className="hidden text-sm text-jetta-metal hover:text-jetta-blue sm:block"
            >
              Ver todos
            </Link>
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-jetta-metal/30 text-jetta-ice hover:border-jetta-blue hover:text-jetta-blue"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Próximo"
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-jetta-metal/30 text-jetta-ice hover:border-jetta-blue hover:text-jetta-blue"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {products.map((product) => (
              <div key={product.id} className="min-w-[70%] sm:min-w-[40%] lg:min-w-[25%]">
                <ProductCard product={product} whatsappNumber={whatsappNumber} />
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/lancamentos"
          className="mt-6 block text-center text-sm text-jetta-metal hover:text-jetta-blue sm:hidden"
        >
          Ver todos
        </Link>
      </div>
    </section>
  );
}
