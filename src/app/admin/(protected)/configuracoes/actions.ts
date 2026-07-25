"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { storeSettingsSchema } from "@/lib/validators/product";
import { logAdminAction } from "@/lib/db/adminLog";

export async function updateStoreSettings(input: unknown) {
  const parsed = storeSettingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const data = parsed.data;

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      storeName: data.storeName,
      whatsappNumber: data.whatsappNumber,
      instagramUrl: data.instagramUrl || null,
      address: data.address || null,
      businessHours: data.businessHours || null,
      whatsappMessageTemplate: data.whatsappMessageTemplate,
      exchangePolicy: data.exchangePolicy || null,
      privacyPolicy: data.privacyPolicy || null,
      shippingInfo: data.shippingInfo || null,
      primaryColor: data.primaryColor || null,
      logoUrl: data.logoUrl || null,
      faviconUrl: data.faviconUrl || null,
    },
    create: {
      id: 1,
      storeName: data.storeName,
      whatsappNumber: data.whatsappNumber,
      instagramUrl: data.instagramUrl || null,
      address: data.address || null,
      businessHours: data.businessHours || null,
      whatsappMessageTemplate: data.whatsappMessageTemplate,
      exchangePolicy: data.exchangePolicy || null,
      privacyPolicy: data.privacyPolicy || null,
      shippingInfo: data.shippingInfo || null,
      primaryColor: data.primaryColor || null,
      logoUrl: data.logoUrl || null,
      faviconUrl: data.faviconUrl || null,
    },
  });

  await logAdminAction("update", "StoreSettings", "1");
  revalidatePath("/", "layout");
  return { success: true };
}
