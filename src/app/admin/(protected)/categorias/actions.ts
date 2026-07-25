"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validators/product";
import { logAdminAction } from "@/lib/db/adminLog";

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002",
  );
}

export async function createCategory(input: unknown) {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  try {
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        imageUrl: parsed.data.imageUrl || null,
        isActive: parsed.data.isActive,
      },
    });
    await logAdminAction("create", "Category", category.id, { name: category.name });
    revalidatePath("/admin/categorias");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { success: true, category };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { error: "Já existe uma categoria com este slug." };
    throw error;
  }
}

export async function updateCategory(id: string, input: unknown) {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        imageUrl: parsed.data.imageUrl || null,
        isActive: parsed.data.isActive,
      },
    });
    await logAdminAction("update", "Category", id);
    revalidatePath("/admin/categorias");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { error: "Já existe uma categoria com este slug." };
    throw error;
  }
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return { error: "Existem produtos nesta categoria. Desative-a em vez de excluir." };
  }
  await prisma.category.delete({ where: { id } });
  await logAdminAction("delete", "Category", id);
  revalidatePath("/admin/categorias");
  return { success: true };
}
