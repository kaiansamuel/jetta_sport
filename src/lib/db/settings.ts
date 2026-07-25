import { prisma } from "./prisma";

const FALLBACK_WHATSAPP_NUMBER = process.env.WHATSAPP_DEFAULT_NUMBER ?? "5511999999999";

export async function getStoreSettings() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });

  return (
    settings ?? {
      id: 1,
      storeName: "Jetta Sport",
      whatsappNumber: FALLBACK_WHATSAPP_NUMBER,
      instagramUrl: null,
      address: null,
      businessHours: null,
      whatsappMessageTemplate: "",
      exchangePolicy: null,
      privacyPolicy: null,
      shippingInfo: null,
      primaryColor: null,
      logoUrl: null,
      faviconUrl: null,
      updatedAt: new Date(),
    }
  );
}
