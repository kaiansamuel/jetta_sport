"use server";

import { prisma } from "@/lib/db/prisma";
import { submitOrderSchema, type SubmitOrderInput } from "@/lib/validators/checkout";
import { buildOrderMessage } from "@/lib/whatsapp/buildOrderMessage";
import { buildWaLink } from "@/lib/whatsapp/waLink";
import { logAnalyticsEvent } from "@/lib/analytics/track";
import { checkRateLimit } from "@/lib/security/rateLimit";

export interface SubmitOrderResult {
  orderCode?: string;
  whatsappUrl?: string;
  error?: string;
}

function cartSignature(items: { variantId: string; quantity: number }[]) {
  return items
    .map((item) => `${item.variantId}:${item.quantity}`)
    .sort()
    .join("|");
}

/**
 * Order-before-WhatsApp sequencing: validate → persist the Order (status
 * INICIADO) → build the wa.me link from the persisted order → flip status to
 * ENVIADO_WHATSAPP. The DB write always happens before the WhatsApp handoff,
 * so abandoned checkouts remain visible to the admin. Note: ENVIADO_WHATSAPP
 * only means the link was generated and handed to the client — there is no
 * delivery confirmation from WhatsApp itself.
 */
export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  const parsed = submitOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados inválidos. Verifique o formulário e tente novamente." };
  }
  const { customer, items } = parsed.data;

  if (!checkRateLimit(`order:${customer.phone}`, 5, 10 * 60_000)) {
    return { error: "Muitas tentativas de pedido em pouco tempo. Aguarde alguns minutos." };
  }

  const signature = cartSignature(items);
  const oneMinuteAgo = new Date(Date.now() - 60_000);
  const recentOrder = await prisma.order.findFirst({
    where: { phone: customer.phone, createdAt: { gte: oneMinuteAgo } },
    include: { items: { select: { variantId: true, quantity: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (recentOrder && cartSignature(recentOrder.items) === signature) {
    return {
      error: "Este pedido já foi enviado há poucos instantes. Confira seu WhatsApp.",
    };
  }

  const variantIds = items.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  for (const item of items) {
    const variant = variantMap.get(item.variantId);
    if (!variant || !variant.product.isActive) {
      return { error: `${item.productName} não está mais disponível.` };
    }
    if (variant.stock < item.quantity) {
      return {
        error: `${item.productName} (${item.color}, ${item.size}) não tem estoque suficiente. Atualize seu carrinho.`,
      };
    }
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return { error: "Loja não configurada. Tente novamente mais tarde." };
  }

  const orderItemsData = items.map((item) => {
    const variant = variantMap.get(item.variantId)!;
    const unitPrice =
      variant.product.isPromotion && variant.product.promotionalPrice
        ? Number(variant.product.promotionalPrice)
        : Number(variant.product.price);

    return {
      productId: item.productId,
      variantId: item.variantId,
      productName: variant.product.name,
      imageUrl: item.imageUrl,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItemsData.reduce((sum, item) => sum + item.subtotal, 0);
  const year = new Date().getFullYear();

  const order = await prisma.$transaction(async (tx) => {
    const sequence = await tx.orderSequence.update({
      where: { id: 1 },
      data: { nextVal: { increment: 1 } },
    });
    const code = `JS-${year}-${String(sequence.nextVal - 1).padStart(5, "0")}`;

    return tx.order.create({
      data: {
        code,
        customerName: customer.customerName,
        phone: customer.phone,
        zipCode: customer.zipCode,
        city: customer.city,
        state: customer.state,
        neighborhood: customer.neighborhood,
        address: customer.address,
        addressNumber: customer.addressNumber,
        complement: customer.complement,
        deliveryType: customer.deliveryType,
        notes: customer.notes,
        subtotal,
        status: "INICIADO",
        origin: "site",
        items: { create: orderItemsData },
      },
      include: { items: true },
    });
  });

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

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "ENVIADO_WHATSAPP", whatsappSentAt: new Date() },
  });

  await logAnalyticsEvent("whatsapp_sent", { orderCode: order.code, subtotal });

  return { orderCode: order.code, whatsappUrl };
}
