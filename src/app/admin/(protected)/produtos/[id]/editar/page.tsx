import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Editar produto" };

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } }, variants: true },
    }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const initialValues: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    shortDescription: product.shortDescription,
    brandId: product.brandId,
    categoryId: product.categoryId,
    gender: product.gender,
    style: product.style,
    material: product.material ?? "",
    price: product.price.toString(),
    promotionalPrice: product.promotionalPrice?.toString() ?? "",
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isPromotion: product.isPromotion,
    isActive: product.isActive,
    displayOrder: product.displayOrder.toString(),
    images: product.images.map((img) => ({ url: img.url, altText: img.altText ?? undefined })),
    variants: product.variants.map((v) => ({ id: v.id, color: v.color, size: v.size, stock: v.stock })),
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Editar produto</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm
          mode="edit"
          initialValues={initialValues}
          brands={brands}
          categories={categories}
        />
      </div>
    </div>
  );
}
