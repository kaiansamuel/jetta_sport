import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductForm, EMPTY_PRODUCT_FORM } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Novo produto" };

export default async function NovoProdutoPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Novo produto</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm
          mode="create"
          initialValues={EMPTY_PRODUCT_FORM}
          brands={brands}
          categories={categories}
        />
      </div>
    </div>
  );
}
