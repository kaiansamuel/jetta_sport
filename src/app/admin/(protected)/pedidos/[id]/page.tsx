import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Detalhe do pedido" };

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-jetta-ice">{order.code}</h1>
          <p className="text-sm text-jetta-metal">
            Criado em {formatDateTime(order.createdAt)}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <p className="text-sm font-semibold text-jetta-ice">Itens</p>
          <div className="mt-3 divide-y divide-jetta-metal/10">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-jetta-ice">
                    {item.quantity}x {item.productName}
                  </p>
                  <p className="text-xs text-jetta-metal">
                    {item.color} · {item.size}
                  </p>
                </div>
                <p className="text-jetta-ice">{formatCurrency(Number(item.subtotal))}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-jetta-metal/15 pt-4 text-sm font-semibold">
            <span className="text-jetta-metal">Subtotal</span>
            <span className="text-jetta-ice">{formatCurrency(Number(order.subtotal))}</span>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-jetta-ice">Cliente</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Nome" value={order.customerName} />
              <Row label="Telefone" value={order.phone} />
              <Row label="CEP" value={order.zipCode ?? "—"} />
              <Row
                label="Cidade"
                value={[order.city, order.state].filter(Boolean).join(" - ") || "—"}
              />
              <Row label="Endereço" value={order.address ?? "—"} />
              <Row label="Entrega" value={order.deliveryType ?? "—"} />
              <Row label="Observação" value={order.notes ?? "—"} />
            </dl>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-jetta-ice">WhatsApp</p>
            <p className="mt-2 text-sm text-jetta-metal">
              {order.whatsappSentAt
                ? `Link gerado em ${formatDateTime(order.whatsappSentAt)}`
                : "Link ainda não gerado."}
            </p>
            <p className="mt-1 text-xs text-jetta-metal">
              Isso indica que o link foi entregue ao cliente, não que a mensagem foi
              confirmadamente enviada pelo WhatsApp.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-jetta-metal">{label}</dt>
      <dd className="text-right text-jetta-ice">{value}</dd>
    </div>
  );
}
