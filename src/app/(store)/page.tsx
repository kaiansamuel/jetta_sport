import { prisma } from "@/lib/db/prisma";
import { getStoreSettings } from "@/lib/db/settings";
import { getProducts } from "@/lib/db/products";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LaunchesCarousel } from "@/components/home/LaunchesCarousel";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCta } from "@/components/home/FinalCta";
import { ProductGrid } from "@/components/product/ProductGrid";
import { LightBeams } from "@/components/decor/LightBeams";

export default async function HomePage() {
  const now = new Date();

  const [settings, categories, brands, featured, launches, promoBanner] =
    await Promise.all([
      getStoreSettings(),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      getProducts({ isFeatured: true, pageSize: 8 }),
      getProducts({ isNew: true, pageSize: 8 }),
      prisma.banner.findFirst({
        where: {
          placement: "promo",
          isActive: true,
          AND: [
            { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
            { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          ],
        },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

  return (
    <>
      <LightBeams />

      <HeroShowcase storeName={settings.storeName} whatsappNumber={settings.whatsappNumber} />

      <CategoryGrid categories={categories} />

      {featured.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-jetta-ice">
            Produtos em destaque
          </h2>
          <div className="mt-6">
            <ProductGrid products={featured.items} whatsappNumber={settings.whatsappNumber} />
          </div>
        </section>
      )}

      <LaunchesCarousel products={launches.items} whatsappNumber={settings.whatsappNumber} />

      <PromoBanner banner={promoBanner} />

      <BrandMarquee brands={brands} />

      <Testimonials instagramUrl={settings.instagramUrl} />

      <FinalCta storeName={settings.storeName} whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
