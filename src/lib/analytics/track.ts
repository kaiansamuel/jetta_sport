import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type AnalyticsEventType =
  | "product_view"
  | "category_click"
  | "search"
  | "filter_applied"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_start"
  | "whatsapp_sent"
  | "instagram_click"
  | "banner_click";

export async function logAnalyticsEvent(
  type: AnalyticsEventType,
  metadata?: Prisma.InputJsonValue,
  sessionId?: string,
) {
  try {
    await prisma.analyticsEvent.create({
      data: { type, metadata, sessionId },
    });
  } catch (error) {
    // Analytics must never break the user-facing flow it's observing.
    console.error("Failed to log analytics event", error);
  }
}
