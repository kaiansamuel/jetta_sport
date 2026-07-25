"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, useCartSubtotal } from "@/store/cartStore";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { formatCurrency } from "@/lib/utils/format";

export default function CheckoutPage() {
  const hydrated = useCartStore((state) => state.hydrated);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartSubtotal();
  const track = useTrackEvent();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      router.replace("/carrinho");
      return;
    }
    track("checkout_start", { itemCount: items.length });
    // Deliberately only re-running when hydration/emptiness actually change,
    // not on every items mutation (quantity edits, etc.) — this is a
    // one-time "did we land here with something to check out" gate, not a
    // continuous sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, items.length === 0]);

  if (!hydrated || items.length === 0) {
    return <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6" />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Finalizar pedido</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <CheckoutForm items={items} />

        <div className="h-fit rounded-2xl border border-jetta-metal/15 bg-jetta-graphite/40 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-jetta-ice">Resumo do pedido</p>
            <Link href="/carrinho" className="text-xs text-jetta-blue hover:underline">
              Editar carrinho
            </Link>
          </div>

          <div className="mt-4 divide-y divide-jetta-metal/10">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex justify-between py-3 text-sm first:pt-0"
              >
                <div>
                  <p className="text-jetta-ice">
                    {item.quantity}x {item.productName}
                  </p>
                  <p className="text-xs text-jetta-metal">
                    {item.color} · {item.size}
                  </p>
                </div>
                <p className="text-jetta-ice">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-jetta-metal/15 pt-4">
            <span className="text-jetta-metal">Subtotal</span>
            <span className="font-display text-lg font-bold text-jetta-ice">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
