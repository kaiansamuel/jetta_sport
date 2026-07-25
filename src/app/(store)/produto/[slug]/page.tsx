import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";
import { getStoreSettings } from "@/lib/db/settings";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ShippingEstimate } from "@/components/product/ShippingEstimate";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description = product.shortDescription;
  const imageUrl = product.images[0]?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getStoreSettings(),
  ]);

  if (!product) notFound();

  const related = await getRelatedProducts(product);

  const price = Number(product.price);
  const promotionalPrice = product.promotionalPrice ? Number(product.promotionalPrice) : null;
  const inStock = product.variants.some((v) => v.stock > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand.name },
    image: product.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: promotionalPrice ?? price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `${baseUrl}/catalogo?categoria=${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${baseUrl}/produto/${product.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ProductViewTracker productId={product.id} productSlug={product.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-jetta-metal">
        <Link href="/catalogo" className="hover:text-jetta-blue">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/catalogo?categoria=${product.category.slug}`}
          className="hover:text-jetta-blue"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-jetta-ice" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <ProductPurchasePanel
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              shortDescription: product.shortDescription,
              price,
              promotionalPrice,
              isPromotion: product.isPromotion,
              brandName: product.brand.name,
              imageUrl: product.images[0]?.url ?? null,
              variants: product.variants,
            }}
            whatsappNumber={settings.whatsappNumber}
            storeName={settings.storeName}
          />

          <ShippingEstimate />

          <div className="rounded-2xl border border-jetta-metal/15 p-4">
            <p className="text-xs font-semibold tracking-wide text-jetta-metal uppercase">
              Informações do produto
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-jetta-metal">Gênero</dt>
                <dd className="text-jetta-ice capitalize">{product.gender}</dd>
              </div>
              <div>
                <dt className="text-jetta-metal">Estilo</dt>
                <dd className="text-jetta-ice">{product.style}</dd>
              </div>
              {product.material && (
                <div>
                  <dt className="text-jetta-metal">Material</dt>
                  <dd className="text-jetta-ice">{product.material}</dd>
                </div>
              )}
              <div>
                <dt className="text-jetta-metal">Código</dt>
                <dd className="text-jetta-ice">{product.sku}</dd>
              </div>
            </dl>
          </div>

          <p className="text-sm text-jetta-metal">{product.description}</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-jetta-ice">
            Produtos relacionados
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} whatsappNumber={settings.whatsappNumber} />
          </div>
        </section>
      )}
    </div>
  );
}
