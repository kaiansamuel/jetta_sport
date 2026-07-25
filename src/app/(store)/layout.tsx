import { getStoreSettings } from "@/lib/db/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header storeName={settings.storeName} whatsappNumber={settings.whatsappNumber} />
      <div className="flex-1">{children}</div>
      <Footer
        storeName={settings.storeName}
        instagramUrl={settings.instagramUrl}
        address={settings.address}
        businessHours={settings.businessHours}
      />
    </div>
  );
}
