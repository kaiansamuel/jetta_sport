// Shared between prisma/seed.ts (seeded StoreSettings default) and
// buildOrderMessage.ts (fallback when the admin-configured template is
// empty), so both stay in sync with the exact format from PRD §11.3.
export const DEFAULT_WHATSAPP_TEMPLATE = `Olá, {storeName}! Quero finalizar este pedido:

PEDIDO: {code}

{items}

Subtotal: {subtotal}

Cliente: {customerName}
CEP: {zipCode}
Cidade: {city}
Entrega: {deliveryType}
Observação: {notes}

Aguardo a confirmação de estoque, frete e pagamento.`;
