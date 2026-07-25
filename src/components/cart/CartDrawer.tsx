"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartSubtotal();
  const track = useTrackEvent();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-jetta-graphite"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-jetta-metal/15 p-4">
              <span className="font-display text-sm font-bold tracking-widest text-jetta-ice uppercase">
                Carrinho
              </span>
              <button
                type="button"
                aria-label="Fechar carrinho"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full text-jetta-ice hover:text-jetta-red"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="text-sm text-jetta-metal">Seu carrinho está vazio.</p>
                <Link href="/catalogo" onClick={onClose}>
                  <Button size="sm">Ver catálogo</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-jetta-metal/15 overflow-y-auto p-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 py-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-jetta-black">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-1 text-xs font-semibold text-jetta-ice">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-jetta-metal">
                          {item.color} · {item.size}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            aria-label="Diminuir quantidade"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-jetta-metal/30 text-jetta-ice"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label="Aumentar quantidade"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-jetta-metal/30 text-jetta-ice"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeItem(item.variantId);
                              track("remove_from_cart", { variantId: item.variantId });
                            }}
                            aria-label={`Remover ${item.productName}`}
                            className="ml-1 text-jetta-metal hover:text-jetta-red"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-jetta-ice">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-jetta-metal/15 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-jetta-metal">Subtotal</span>
                    <span className="font-display font-bold text-jetta-ice">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <Link href="/carrinho" onClick={onClose} className="block">
                    <Button variant="ghost" className="w-full">
                      Ver carrinho
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={onClose} className="mt-2 block">
                    <Button variant="whatsapp" className="w-full">
                      Finalizar pelo WhatsApp
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
