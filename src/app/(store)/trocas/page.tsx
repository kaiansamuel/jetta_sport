import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Política de troca",
  alternates: { canonical: "/trocas" },
};

export default async function TrocasPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice sm:text-3xl">
        Política de troca
      </h1>
      <p className="mt-4 whitespace-pre-line text-jetta-metal">
        {settings.exchangePolicy || "Política de troca ainda não configurada."}
      </p>
    </div>
  );
}
