import type { Metadata } from "next";
import { getProducts } from "@/lib/db/products";
import { getStoreSettings } from "@/lib/db/settings";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/product/Pagination";

export const metadata: Metadata = {
  title: "Lançamentos",
  description: "Novos modelos. Nova energia.",
  alternates: { canonical: "/lancamentos" },
};

export default async function LancamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const [{ items, page, pageCount }, settings] = await Promise.all([
    getProducts({ isNew: true, page: pagina ? Number(pagina) : 1 }),
    getStoreSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold tracking-wide text-jetta-blue-text uppercase">
        Novos modelos. Nova energia.
      </p>
      <h1 className="font-display mt-1 text-2xl font-bold text-jetta-ice sm:text-3xl">
        Lançamentos
      </h1>

      <div className="mt-8">
        <ProductGrid products={items} whatsappNumber={settings.whatsappNumber} />
        <Pagination page={page} pageCount={pageCount} basePath="/lancamentos" searchParams={{}} />
      </div>
    </div>
  );
}
