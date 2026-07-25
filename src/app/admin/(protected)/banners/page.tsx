import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { BannersManager } from "@/components/admin/BannersManager";

export const metadata: Metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Banners</h1>
      <div className="mt-6">
        <BannersManager banners={banners} />
      </div>
    </div>
  );
}
