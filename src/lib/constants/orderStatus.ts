import type { OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  INICIADO: "Iniciado",
  ENVIADO_WHATSAPP: "Enviado ao WhatsApp",
  EM_ATENDIMENTO: "Em atendimento",
  CONFIRMADO: "Confirmado",
  PAGO: "Pago",
  ENVIADO: "Enviado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [
  OrderStatus,
  string,
][];
