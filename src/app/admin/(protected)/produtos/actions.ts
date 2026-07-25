"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { productSchema } from "@/lib/validators/product";
import { logAdminAction } from "@/lib/db/adminLog";

interface ActionResult {
  success?: boolean;
  id?: string;
  error?: string;
}

function revalidateStorefront() {
  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/promocoes");
}

export async function createProduct(input: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const data = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        shortDescription: data.shortDescription,
        brandId: data.brandId,
        categoryId: data.categoryId,
        gender: data.gender,
        style: data.style,
        material: data.material || null,
        price: data.price,
        promotionalPrice: data.promotionalPrice,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        isPromotion: data.isPromotion,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        images: {
          create: data.images.map((img, index) => ({
            url: img.url,
            altText: img.altText,
            order: index,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({ color: v.color, size: v.size, stock: v.stock })),
        },
      },
    });

    await logAdminAction("create", "Product", product.id, { name: product.name });
    revalidateStorefront();
    return { success: true, id: product.id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Já existe um produto com este slug ou SKU." };
    }
    throw error;
  }
}

export async function updateProduct(id: string, input: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          description: data.description,
          shortDescription: data.shortDescription,
          brandId: data.brandId,
          categoryId: data.categoryId,
          gender: data.gender,
          style: data.style,
          material: data.material || null,
          price: data.price,
          promotionalPrice: data.promotionalPrice,
          isFeatured: data.isFeatured,
          isNew: data.isNew,
          isPromotion: data.isPromotion,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        },
      });

      await tx.productImage.deleteMany({ where: { productId: id } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, index) => ({
            productId: id,
            url: img.url,
            altText: img.altText,
            order: index,
          })),
        });
      }

      const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
      const incomingIds = new Set(data.variants.filter((v) => v.id).map((v) => v.id));
      const toRemove = existingVariants.filter((v) => !incomingIds.has(v.id));

      for (const variant of toRemove) {
        try {
          await tx.productVariant.delete({ where: { id: variant.id } });
        } catch {
          // Variant has order history (FK constraint) — keep it with its
          // current stock rather than losing referential integrity on past
          // orders. The admin can zero its stock instead of deleting it.
        }
      }

      for (const variant of data.variants) {
        if (variant.id) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { color: variant.color, size: variant.size, stock: variant.stock },
          });
        } else {
          await tx.productVariant.create({
            data: { productId: id, color: variant.color, size: variant.size, stock: variant.stock },
          });
        }
      }
    });

    await logAdminAction("update", "Product", id, { name: data.name });
    revalidateStorefront();
    revalidatePath(`/produto/${data.slug}`);
    return { success: true, id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Já existe um produto com este slug, SKU ou combinação de cor/numeração." };
    }
    throw error;
  }
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<ActionResult> {
  await prisma.product.update({ where: { id }, data: { isActive } });
  await logAdminAction("update", "Product", id, { isActive });
  revalidateStorefront();
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return {
      error:
        "Este produto tem pedidos associados e não pode ser excluído. Desative-o em vez de excluir.",
    };
  }

  await prisma.product.delete({ where: { id } });
  await logAdminAction("delete", "Product", id);
  revalidateStorefront();
  return { success: true };
}

export async function duplicateProduct(id: string): Promise<ActionResult> {
  const original = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });
  if (!original) return { error: "Produto não encontrado." };

  const baseSlug = `${original.slug}-copia`;
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const copy = await prisma.product.create({
    data: {
      name: `${original.name} (cópia)`,
      slug,
      sku: `${original.sku}-COPY-${Date.now().toString(36).toUpperCase()}`,
      description: original.description,
      shortDescription: original.shortDescription,
      brandId: original.brandId,
      categoryId: original.categoryId,
      gender: original.gender,
      style: original.style,
      material: original.material,
      price: original.price,
      promotionalPrice: original.promotionalPrice,
      isFeatured: false,
      isNew: original.isNew,
      isPromotion: original.isPromotion,
      isActive: false,
      displayOrder: original.displayOrder,
      images: {
        create: original.images.map((img) => ({
          url: img.url,
          altText: img.altText,
          order: img.order,
        })),
      },
      // Stock reset to 0 on duplicates — avoids silently doubling real
      // inventory when the admin just wants to reuse a product as a template.
      variants: {
        create: original.variants.map((v) => ({ color: v.color, size: v.size, stock: 0 })),
      },
    },
  });

  await logAdminAction("create", "Product", copy.id, { duplicatedFrom: id });
  revalidateStorefront();
  return { success: true, id: copy.id };
}

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002",
  );
}
