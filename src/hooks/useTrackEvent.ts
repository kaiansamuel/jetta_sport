"use client";

import { useCallback } from "react";
import type { AnalyticsEventType } from "@/lib/analytics/track";

export function useTrackEvent() {
  return useCallback((type: AnalyticsEventType, metadata?: Record<string, unknown>) => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, metadata }),
      keepalive: true,
    }).catch(() => {});
  }, []);
}
