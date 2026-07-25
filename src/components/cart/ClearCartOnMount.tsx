"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

// Clears the cart once the order-confirmation page has actually mounted,
// i.e. after navigation away from /checkout has completed — see the comment
// in checkout/page.tsx for why clearing happens here and not mid-checkout.
export function ClearCartOnMount() {
  useEffect(() => {
    useCartStore.getState().clear();
  }, []);

  return null;
}
