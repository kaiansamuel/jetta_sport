import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/db/settings";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";

export const metadata: Metadata = { title: "Configurações" };

export default async function AdminConfiguracoesPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Configurações</h1>
      <div className="mt-6">
        <StoreSettingsForm
          initialValues={{
            storeName: settings.storeName,
            whatsappNumber: settings.whatsappNumber,
            instagramUrl: settings.instagramUrl ?? "",
            address: settings.address ?? "",
            businessHours: settings.businessHours ?? "",
            whatsappMessageTemplate: settings.whatsappMessageTemplate,
            exchangePolicy: settings.exchangePolicy ?? "",
            privacyPolicy: settings.privacyPolicy ?? "",
            shippingInfo: settings.shippingInfo ?? "",
            primaryColor: settings.primaryColor ?? "",
            logoUrl: settings.logoUrl ?? "",
            faviconUrl: settings.faviconUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
