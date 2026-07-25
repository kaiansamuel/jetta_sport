import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { BrandsManager } from "@/components/admin/BrandsManager";

export const metadata: Metadata = { title: "Marcas" };

export default async function AdminMarcasPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Marcas</h1>
      <div className="mt-6">
        <BrandsManager brands={brands} />
      </div>
    </div>
  );
}
