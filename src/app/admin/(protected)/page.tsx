import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { getDashboardMetrics } from "@/lib/db/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const cards = [
    { label: "Total de produtos", value: metrics.totalProducts },
    { label: "Produtos ativos", value: metrics.activeProducts },
    { label: "Produtos sem estoque", value: metrics.outOfStockProducts },
    { label: "Pedidos hoje", value: metrics.ordersToday },
    { label: "Pedidos enviados ao WhatsApp (total)", value: metrics.ordersSentTotal },
    {
      label: "Taxa de conversão WhatsApp",
      value:
        metrics.conversionRate != null ? `${metrics.conversionRate.toFixed(1)}%` : "—",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Dashboard</h1>
      <p className="mt-1 text-sm text-jetta-metal">
        &ldquo;Enviado ao WhatsApp&rdquo; significa que o link foi gerado e entregue ao
        cliente — não há confirmação de que a mensagem foi de fato enviada pelo
        WhatsApp.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-xs tracking-wide text-jetta-metal uppercase">{card.label}</p>
            <p className="font-display mt-2 text-3xl font-bold text-jetta-ice">
              {card.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <RankingCard
          title="Mais adicionados ao carrinho"
          items={metrics.topAddedToCart.map((item) => ({
            label: item.name,
            value: item.count,
          }))}
        />
        <RankingCard
          title="Mais enviados ao WhatsApp"
          items={metrics.topWhatsappProducts.map((item) => ({
            label: item.name,
            value: item.count,
          }))}
        />
        <RankingCard
          title="Numerações mais procuradas"
          items={metrics.topSizes.map((item) => ({
            label: `Tamanho ${item.size}`,
            value: item.count,
          }))}
        />
      </div>
    </div>
  );
}

function RankingCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold tracking-wide text-jetta-metal uppercase">
        {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-jetta-metal">Sem dados ainda.</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-jetta-ice">
                {index + 1}. {item.label}
              </span>
              <span className="text-jetta-metal">{item.value}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
