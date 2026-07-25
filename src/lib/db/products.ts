import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

export type ProductSort =
  | "recent"
  | "price_asc"
  | "price_desc"
  | "discount"
  | "featured";

export interface ProductFilters {
  categorySlug?: string;
  brandSlug?: string;
  sizes?: string[];
  colors?: string[];
  priceMin?: number;
  priceMax?: number;
  isNew?: boolean;
  isPromotion?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  q?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

const PAGE_SIZE_DEFAULT = 24;

const productListInclude = {
  brand: true,
  category: true,
  images: { orderBy: { order: "asc" as const }, take: 2 },
  variants: true,
} satisfies Prisma.ProductInclude;

type ProductListItemRaw = Prisma.ProductGetPayload<{
  include: typeof productListInclude;
}>;

// Prisma's Decimal instances aren't plain objects, so Next.js refuses to
// pass them from a Server Component straight into a Client Component
// (ProductCard is "use client"). Converting price fields to numbers here,
// once, keeps every caller of getProducts/getRelatedProducts safe by
// construction instead of relying on each call site to remember to convert.
export type ProductListItem = Omit<ProductListItemRaw, "price" | "promotionalPrice"> & {
  price: number;
  promotionalPrice: number | null;
};

function serializeProduct(product: ProductListItemRaw): ProductListItem {
  return {
    ...product,
    price: Number(product.price),
    promotionalPrice: product.promotionalPrice ? Number(product.promotionalPrice) : null,
  };
}

function buildOrderBy(
  sort: ProductSort | undefined,
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "featured":
      return [{ isFeatured: "desc" }, { displayOrder: "asc" }];
    case "discount":
      // Approximation for MVP catalog scale: promotions on higher-priced
      // items surface first. A precise "maior desconto" ranking needs a
      // computed discount-percentage column or a raw SQL sort, which isn't
      // worth the complexity for a ~dozens-of-products catalog.
      return [{ isPromotion: "desc" }, { price: "desc" }];
    case "recent":
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function getProducts(filters: ProductFilters) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const pageSize = filters.pageSize ?? PAGE_SIZE_DEFAULT;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.categorySlug) where.category = { slug: filters.categorySlug };
  if (filters.brandSlug) where.brand = { slug: filters.brandSlug };
  if (filters.isNew) where.isNew = true;
  if (filters.isPromotion) where.isPromotion = true;
  if (filters.isFeatured) where.isFeatured = true;

  if (filters.priceMin != null || filters.priceMax != null) {
    where.price = {
      ...(filters.priceMin != null ? { gte: filters.priceMin } : {}),
      ...(filters.priceMax != null ? { lte: filters.priceMax } : {}),
    };
  }

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const variantConditions: Prisma.ProductVariantWhereInput[] = [];
  if (filters.sizes?.length) variantConditions.push({ size: { in: filters.sizes } });
  if (filters.colors?.length) variantConditions.push({ color: { in: filters.colors } });
  if (filters.inStock) variantConditions.push({ stock: { gt: 0 } });

  if (variantConditions.length) {
    where.variants = {
      some:
        variantConditions.length === 1
          ? variantConditions[0]
          : { AND: variantConditions },
    };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: productListInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(serializeProduct),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });
}

export async function getRelatedProducts(product: {
  id: string;
  categoryId: string;
}): Promise<ProductListItem[]> {
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: productListInclude,
  });
  return related.map(serializeProduct);
}

export async function getFilterOptions() {
  const [brands, categories, variants] = await Promise.all([
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.productVariant.findMany({
      distinct: ["color"],
      select: { color: true },
    }),
  ]);

  const sizes = await prisma.productVariant.findMany({
    distinct: ["size"],
    select: { size: true },
  });

  return {
    brands,
    categories,
    colors: variants.map((v) => v.color).sort(),
    sizes: sizes.map((s) => s.size).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)),
  };
}
