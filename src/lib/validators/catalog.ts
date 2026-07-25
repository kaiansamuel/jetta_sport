import type { ProductSort } from "@/lib/db/products";

export interface CatalogSearchParams {
  categoria?: string;
  marca?: string;
  cor?: string;
  tamanho?: string;
  precoMin?: string;
  precoMax?: string;
  novo?: string;
  promocao?: string;
  disponivel?: string;
  ordenar?: string;
  q?: string;
  pagina?: string;
}

const SORT_MAP: Record<string, ProductSort> = {
  recente: "recent",
  "menor-preco": "price_asc",
  "maior-preco": "price_desc",
  "maior-desconto": "discount",
  destaque: "featured",
};

export function parseCatalogFilters(searchParams: CatalogSearchParams) {
  return {
    categorySlug: searchParams.categoria || undefined,
    brandSlug: searchParams.marca || undefined,
    colors: searchParams.cor ? searchParams.cor.split(",").filter(Boolean) : undefined,
    sizes: searchParams.tamanho
      ? searchParams.tamanho.split(",").filter(Boolean)
      : undefined,
    priceMin: searchParams.precoMin ? Number(searchParams.precoMin) : undefined,
    priceMax: searchParams.precoMax ? Number(searchParams.precoMax) : undefined,
    isNew: searchParams.novo === "1",
    isPromotion: searchParams.promocao === "1",
    inStock: searchParams.disponivel === "1",
    q: searchParams.q || undefined,
    sort: searchParams.ordenar ? SORT_MAP[searchParams.ordenar] : undefined,
    page: searchParams.pagina ? Number(searchParams.pagina) : 1,
  };
}

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "recente", label: "Mais recentes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "maior-desconto", label: "Maior desconto" },
  { value: "destaque", label: "Destaque" },
];
