import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from "@/lib/constants/orderStatus";
import type { OrderStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus =
    status && (Object.keys(ORDER_STATUS_LABELS) as string[]).includes(status)
      ? (status as OrderStatus)
      : undefined;

  const orders = await prisma.order.findMany({
    where: validStatus ? { status: validStatus } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Pedidos</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-full border px-3 py-1.5 text-xs ${!validStatus ? "border-jetta-blue text-jetta-cyan" : "border-jetta-metal/30 text-jetta-metal"}`}
        >
          Todos
        </Link>
        {ORDER_STATUS_OPTIONS.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/pedidos?status=${key}`}
            className={`rounded-full border px-3 py-1.5 text-xs ${validStatus === key ? "border-jetta-blue text-jetta-cyan" : "border-jetta-metal/30 text-jetta-metal"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-jetta-metal/15">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-jetta-metal/15 text-left text-xs tracking-wide text-jetta-metal uppercase">
              <th className="p-3">Código</th>
              <th className="p-3">Data</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-jetta-metal/10">
                <td className="p-3">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="text-jetta-blue hover:underline"
                  >
                    {order.code}
                  </Link>
                </td>
                <td className="p-3 text-jetta-metal">{formatDateTime(order.createdAt)}</td>
                <td className="p-3 text-jetta-ice">{order.customerName}</td>
                <td className="p-3 text-jetta-metal">{order.phone}</td>
                <td className="p-3 text-jetta-ice">{formatCurrency(Number(order.subtotal))}</td>
                <td className="p-3 text-jetta-metal">{ORDER_STATUS_LABELS[order.status]}</td>
                <td className="p-3 text-jetta-metal">
                  {order.whatsappSentAt ? formatDateTime(order.whatsappSentAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-center text-sm text-jetta-metal">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
}
