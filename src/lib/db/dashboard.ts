import { prisma } from "./prisma";

// Aggregations are done in JS after small, targeted queries rather than SQL
// groupBy — MVP catalog/order volume is low enough that this is simpler and
// avoids grouping on JSON metadata fields Prisma can't group by natively.
export async function getDashboardMetrics() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    ordersToday,
    ordersSentTotal,
    checkoutStartCount,
    whatsappSentCount,
    addToCartEvents,
    whatsappOrderItems,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({
      where: { isActive: true, variants: { none: { stock: { gt: 0 } } } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { whatsappSentAt: { not: null } } }),
    prisma.analyticsEvent.count({ where: { type: "checkout_start" } }),
    prisma.analyticsEvent.count({ where: { type: "whatsapp_sent" } }),
    prisma.analyticsEvent.findMany({
      where: { type: "add_to_cart" },
      select: { metadata: true },
    }),
    prisma.orderItem.findMany({
      where: { order: { whatsappSentAt: { not: null } } },
      select: { productName: true, quantity: true, size: true },
    }),
  ]);

  const addToCartCounts = new Map<string, number>();
  for (const event of addToCartEvents) {
    const metadata = event.metadata as { productId?: string } | null;
    if (metadata?.productId) {
      addToCartCounts.set(
        metadata.productId,
        (addToCartCounts.get(metadata.productId) ?? 0) + 1,
      );
    }
  }
  const productIds = [...addToCartCounts.keys()];
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      })
    : [];
  const productNameById = new Map(products.map((p) => [p.id, p.name]));
  const topAddedToCart = [...addToCartCounts.entries()]
    .map(([productId, count]) => ({
      name: productNameById.get(productId) ?? "Produto removido",
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const whatsappProductCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();
  for (const item of whatsappOrderItems) {
    whatsappProductCounts.set(
      item.productName,
      (whatsappProductCounts.get(item.productName) ?? 0) + item.quantity,
    );
    sizeCounts.set(item.size, (sizeCounts.get(item.size) ?? 0) + item.quantity);
  }
  const topWhatsappProducts = [...whatsappProductCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topSizes = [...sizeCounts.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const conversionRate =
    checkoutStartCount > 0 ? (whatsappSentCount / checkoutStartCount) * 100 : null;

  return {
    totalProducts,
    activeProducts,
    outOfStockProducts,
    ordersToday,
    ordersSentTotal,
    conversionRate,
    topAddedToCart,
    topWhatsappProducts,
    topSizes,
  };
}
