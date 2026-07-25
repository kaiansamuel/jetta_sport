import type { Metadata } from "next";
import { getProducts, getFilterOptions } from "@/lib/db/products";
import { getStoreSettings } from "@/lib/db/settings";
import { parseCatalogFilters, type CatalogSearchParams } from "@/lib/validators/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";
import { CatalogToolbar } from "@/components/product/CatalogToolbar";
import { Pagination } from "@/components/product/Pagination";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Navegue por todo o catálogo de tênis da Jetta Sport.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const filters = parseCatalogFilters(resolvedParams);

  const [{ items, total, page, pageCount }, options, settings] = await Promise.all([
    getProducts(filters),
    getFilterOptions(),
    getStoreSettings(),
  ]);

  const filterOptions = {
    categories: options.categories,
    brands: options.brands,
    colors: options.colors,
    sizes: options.sizes,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice sm:text-3xl">
        Catálogo
      </h1>

      <div className="mt-6 flex items-center justify-between gap-3 lg:hidden">
        <MobileFilterDrawer options={filterOptions} />
      </div>

      <div className="mt-4">
        <CatalogToolbar total={total} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters options={filterOptions} />
        </aside>

        <div>
          <ProductGrid products={items} whatsappNumber={settings.whatsappNumber} />
          <Pagination
            page={page}
            pageCount={pageCount}
            basePath="/catalogo"
            searchParams={resolvedParams as Record<string, string | undefined>}
          />
        </div>
      </div>
    </div>
  );
}
