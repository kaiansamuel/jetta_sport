"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { brandSchema } from "@/lib/validators/product";
import { logAdminAction } from "@/lib/db/adminLog";

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002",
  );
}

export async function createBrand(input: unknown) {
  const parsed = brandSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  try {
    const brand = await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        logoUrl: parsed.data.logoUrl || null,
        isActive: parsed.data.isActive,
      },
    });
    await logAdminAction("create", "Brand", brand.id, { name: brand.name });
    revalidatePath("/admin/marcas");
    revalidatePath("/marcas");
    revalidatePath("/");
    return { success: true, brand };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { error: "Já existe uma marca com este slug." };
    throw error;
  }
}

export async function updateBrand(id: string, input: unknown) {
  const parsed = brandSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  try {
    await prisma.brand.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        logoUrl: parsed.data.logoUrl || null,
        isActive: parsed.data.isActive,
      },
    });
    await logAdminAction("update", "Brand", id);
    revalidatePath("/admin/marcas");
    revalidatePath("/marcas");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { error: "Já existe uma marca com este slug." };
    throw error;
  }
}

export async function deleteBrand(id: string) {
  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) {
    return { error: "Existem produtos desta marca. Desative-a em vez de excluir." };
  }
  await prisma.brand.delete({ where: { id } });
  await logAdminAction("delete", "Brand", id);
  revalidatePath("/admin/marcas");
  return { success: true };
}
