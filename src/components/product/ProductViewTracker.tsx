"use client";

import { useEffect } from "react";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export function ProductViewTracker({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const track = useTrackEvent();

  useEffect(() => {
    track("product_view", { productId, productSlug });
    // Fire once per mount — re-tracking on every render would inflate counts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return null;
}
