import { formatCurrency } from "@/lib/utils/format";
import { DEFAULT_WHATSAPP_TEMPLATE } from "./defaultTemplate";

export interface OrderMessageItem {
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderMessageData {
  code: string;
  storeName: string;
  items: OrderMessageItem[];
  subtotal: number;
  customerName: string;
  zipCode?: string | null;
  city?: string | null;
  state?: string | null;
  deliveryType?: string | null;
  notes?: string | null;
}

function formatItemsBlock(items: OrderMessageItem[]) {
  return items
    .map(
      (item) =>
        `${item.quantity}x ${item.productName}\nCor: ${item.color}\nTamanho: ${item.size}\nPreço: ${formatCurrency(item.unitPrice)}`,
    )
    .join("\n\n");
}

/**
 * Pure, DB-free formatter: takes an already-persisted order (with its
 * generated code) and returns the plain-text WhatsApp message. Kept free of
 * side effects so it's trivially unit-testable and reusable both when the
 * order is first created and when re-rendering the confirmation page.
 */
export function buildOrderMessage(data: OrderMessageData, template?: string | null) {
  const cityLine = [data.city, data.state].filter(Boolean).join(" - ");

  const replacements: Record<string, string> = {
    storeName: data.storeName,
    code: data.code,
    items: formatItemsBlock(data.items),
    subtotal: formatCurrency(data.subtotal),
    customerName: data.customerName,
    zipCode: data.zipCode || "Não informado",
    city: cityLine || "Não informado",
    deliveryType: data.deliveryType || "Calcular frete",
    notes: data.notes || "Nenhuma",
  };

  const activeTemplate =
    template && template.trim().length > 0 ? template : DEFAULT_WHATSAPP_TEMPLATE;

  return activeTemplate.replace(/\{(\w+)\}/g, (match, key: string) => replacements[key] ?? match);
}
