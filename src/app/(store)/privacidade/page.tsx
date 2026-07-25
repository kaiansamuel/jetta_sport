import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Política de privacidade",
  alternates: { canonical: "/privacidade" },
};

export default async function PrivacidadePage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice sm:text-3xl">
        Política de privacidade
      </h1>
      <p className="mt-4 whitespace-pre-line text-jetta-metal">
        {settings.privacyPolicy || "Política de privacidade ainda não configurada."}
      </p>
    </div>
  );
}
