import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getStoreSettings } from "@/lib/db/settings";
import { buildOrderMessage } from "@/lib/whatsapp/buildOrderMessage";
import { buildWaLink } from "@/lib/whatsapp/waLink";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

export default async function CheckoutConfirmationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { code }, include: { items: true } }),
    getStoreSettings(),
  ]);

  if (!order) notFound();

  const message = buildOrderMessage(
    {
      code: order.code,
      storeName: settings.storeName,
      items: order.items.map((item) => ({
        productName: item.productName,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
      subtotal: Number(order.subtotal),
      customerName: order.customerName,
      zipCode: order.zipCode,
      city: order.city,
      state: order.state,
      deliveryType: order.deliveryType,
      notes: order.notes,
    },
    settings.whatsappMessageTemplate,
  );
  const whatsappUrl = buildWaLink(settings.whatsappNumber, message);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <ClearCartOnMount />
      <CheckCircle2 className="mx-auto h-12 w-12 text-jetta-cyan" />
      <h1 className="font-display mt-4 text-2xl font-bold text-jetta-ice">
        Pedido {order.code} registrado
      </h1>
      <p className="mt-2 text-jetta-metal">
        Se o WhatsApp não abriu automaticamente, toque no botão abaixo para enviar seu
        pedido ao nosso time.
      </p>

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
        <Button variant="whatsapp" size="lg">
          Abrir WhatsApp
        </Button>
      </a>

      <div className="mt-10 rounded-2xl border border-jetta-metal/15 bg-jetta-graphite/40 p-5 text-left">
        <p className="text-sm font-semibold text-jetta-ice">Resumo</p>
        <div className="mt-3 divide-y divide-jetta-metal/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-jetta-ice">
                {item.quantity}x {item.productName} ({item.color}, {item.size})
              </span>
              <span className="text-jetta-ice">
                {formatCurrency(Number(item.subtotal))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-jetta-metal/15 pt-3 text-sm font-semibold">
          <span className="text-jetta-metal">Subtotal</span>
          <span className="text-jetta-ice">{formatCurrency(Number(order.subtotal))}</span>
        </div>
      </div>

      <Link href="/catalogo" className="mt-8 inline-block text-sm text-jetta-blue hover:underline">
        Continuar comprando
      </Link>
    </div>
  );
}
