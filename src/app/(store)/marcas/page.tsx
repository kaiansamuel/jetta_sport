import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Marcas",
  description: "As marcas que movem o seu estilo.",
  alternates: { canonical: "/marcas" },
};

export default async function MarcasPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice sm:text-3xl">Marcas</h1>
      <p className="mt-1 text-sm text-jetta-metal">As marcas que movem o seu estilo.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/catalogo?marca=${brand.slug}`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-jetta-metal/15 bg-jetta-graphite/60 p-8 text-center transition-colors hover:border-jetta-blue"
          >
            <span className="font-display text-lg font-bold tracking-widest text-jetta-ice uppercase group-hover:text-jetta-blue">
              {brand.name}
            </span>
            <span className="text-xs text-jetta-metal">
              {brand._count.products} produtos
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
