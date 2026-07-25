import { ProductCard } from "./ProductCard";
import type { ProductListItem } from "@/lib/db/products";

export function ProductGrid({
  products,
  whatsappNumber,
}: {
  products: ProductListItem[];
  whatsappNumber: string;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-jetta-metal/20 py-16 text-center text-sm text-jetta-metal">
        Nenhum produto encontrado para os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}
