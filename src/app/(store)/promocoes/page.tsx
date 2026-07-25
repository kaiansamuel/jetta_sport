import type { Metadata } from "next";
import { getProducts } from "@/lib/db/products";
import { getStoreSettings } from "@/lib/db/settings";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/product/Pagination";

export const metadata: Metadata = {
  title: "Promoções",
  description: "Ofertas que correm rápido. Garanta seu modelo antes que a numeração acabe.",
  alternates: { canonical: "/promocoes" },
};

export default async function PromocoesPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const [{ items, page, pageCount }, settings] = await Promise.all([
    getProducts({ isPromotion: true, page: pagina ? Number(pagina) : 1 }),
    getStoreSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold tracking-wide text-jetta-red-text uppercase">
        Ofertas que correm rápido.
      </p>
      <h1 className="font-display mt-1 text-2xl font-bold text-jetta-ice sm:text-3xl">
        Promoções
      </h1>
      <p className="mt-1 text-sm text-jetta-metal">
        Garanta seu modelo antes que a numeração acabe.
      </p>

      <div className="mt-8">
        <ProductGrid products={items} whatsappNumber={settings.whatsappNumber} />
        <Pagination page={page} pageCount={pageCount} basePath="/promocoes" searchParams={{}} />
      </div>
    </div>
  );
}
