import { NextResponse } from "next/server";
import { logAnalyticsEvent, type AnalyticsEventType } from "@/lib/analytics/track";

const VALID_TYPES: AnalyticsEventType[] = [
  "product_view",
  "category_click",
  "search",
  "filter_applied",
  "add_to_cart",
  "remove_from_cart",
  "checkout_start",
  "whatsapp_sent",
  "instagram_click",
  "banner_click",
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const type = body?.type as string | undefined;

  if (!type || !VALID_TYPES.includes(type as AnalyticsEventType)) {
    return NextResponse.json({ error: "Tipo de evento inválido." }, { status: 400 });
  }

  await logAnalyticsEvent(type as AnalyticsEventType, body?.metadata);
  return NextResponse.json({ ok: true });
}
