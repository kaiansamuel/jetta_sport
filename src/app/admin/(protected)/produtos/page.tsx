import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/Button";
import { ProductsTable } from "./ProductsTable";

export const metadata: Metadata = { title: "Produtos" };

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: true, category: true, variants: true },
  });

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    isActive: product.isActive,
    brandName: product.brand.name,
    categoryName: product.category.name,
    totalStock: product.variants.reduce((sum, v) => sum + v.stock, 0),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-jetta-ice">Produtos</h1>
        <Link href="/admin/produtos/novo">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Novo produto
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <ProductsTable products={rows} />
      </div>
    </div>
  );
}
