import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Sobre",
  alternates: { canonical: "/sobre" },
};

export default async function SobrePage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice sm:text-3xl">
        Sobre a {settings.storeName}
      </h1>
      <p className="mt-4 text-jetta-metal">
        A {settings.storeName} é uma loja digital especializada na venda de tênis pela
        internet, com curadoria de marcas, atendimento próximo e finalização de pedidos
        diretamente pelo WhatsApp.
      </p>
      {settings.address && (
        <p className="mt-4 text-sm text-jetta-metal">Endereço: {settings.address}</p>
      )}
      {settings.businessHours && (
        <p className="mt-1 text-sm text-jetta-metal">
          Horário de atendimento: {settings.businessHours}
        </p>
      )}
    </div>
  );
}
