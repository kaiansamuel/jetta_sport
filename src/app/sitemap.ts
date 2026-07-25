import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const STATIC_PATHS = [
  "",
  "/catalogo",
  "/lancamentos",
  "/promocoes",
  "/marcas",
  "/sobre",
  "/perguntas-frequentes",
  "/trocas",
  "/privacidade",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.brand.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produto/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/catalogo?categoria=${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/catalogo?marca=${brand.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries, ...brandEntries];
}
