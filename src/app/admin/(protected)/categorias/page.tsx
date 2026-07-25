import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const metadata: Metadata = { title: "Categorias" };

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Categorias</h1>
      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}
