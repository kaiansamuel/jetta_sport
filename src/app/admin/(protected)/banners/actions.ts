"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { bannerSchema } from "@/lib/validators/product";
import { logAdminAction } from "@/lib/db/adminLog";

function toDate(value?: string) {
  return value ? new Date(value) : null;
}

function revalidateBanners() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function createBanner(input: unknown) {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const data = parsed.data;

  const banner = await prisma.banner.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      imageUrl: data.imageUrl,
      buttonLabel: data.buttonLabel || null,
      buttonLink: data.buttonLink || null,
      placement: data.placement,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
      startsAt: toDate(data.startsAt),
      endsAt: toDate(data.endsAt),
    },
  });

  await logAdminAction("create", "Banner", banner.id, { title: banner.title });
  revalidateBanners();
  return { success: true, banner };
}

export async function updateBanner(id: string, input: unknown) {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const data = parsed.data;

  await prisma.banner.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      imageUrl: data.imageUrl,
      buttonLabel: data.buttonLabel || null,
      buttonLink: data.buttonLink || null,
      placement: data.placement,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
      startsAt: toDate(data.startsAt),
      endsAt: toDate(data.endsAt),
    },
  });

  await logAdminAction("update", "Banner", id);
  revalidateBanners();
  return { success: true };
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
  await logAdminAction("delete", "Banner", id);
  revalidateBanners();
  return { success: true };
}
