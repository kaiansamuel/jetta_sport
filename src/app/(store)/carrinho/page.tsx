"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export default function CarrinhoPage() {
  const hydrated = useCartStore((state) => state.hydrated);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartSubtotal();
  const track = useTrackEvent();

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-jetta-ice">
          Seu carrinho está vazio
        </h1>
        <p className="mt-2 text-jetta-metal">Explore o catálogo e monte seu pedido.</p>
        <Link href="/catalogo" className="mt-6 inline-block">
          <Button>Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice">Carrinho</h1>

      <div className="mt-6 divide-y divide-jetta-metal/15">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-jetta-graphite">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <Link
                href={`/produto/${item.productSlug}`}
                className="text-sm font-semibold text-jetta-ice hover:text-jetta-blue"
              >
                {item.productName}
              </Link>
              <p className="text-xs text-jetta-metal">
                Cor: {item.color} · Tamanho: {item.size}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-jetta-metal/30">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    aria-label="Diminuir quantidade"
                    className="flex h-9 w-9 items-center justify-center text-jetta-ice"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    aria-label="Aumentar quantidade"
                    className="flex h-9 w-9 items-center justify-center text-jetta-ice"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeItem(item.variantId);
                    track("remove_from_cart", { variantId: item.variantId });
                  }}
                  aria-label={`Remover ${item.productName} do carrinho`}
                  className="text-jetta-metal hover:text-jetta-red"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-jetta-ice">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
              <p className="text-xs text-jetta-metal">{formatCurrency(item.unitPrice)} un.</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={clear}
          className="text-sm text-jetta-metal hover:text-jetta-red"
        >
          Limpar carrinho
        </button>
        <Link href="/catalogo" className="text-sm text-jetta-blue-text hover:underline">
          Continuar comprando
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-jetta-metal/15 pt-6">
        <span className="text-jetta-metal">Subtotal</span>
        <span className="font-display text-xl font-bold text-jetta-ice">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <Link href="/checkout" className="mt-6 block">
        <Button variant="whatsapp" size="lg" className="w-full">
          Finalizar pelo WhatsApp
        </Button>
      </Link>
    </div>
  );
}
