"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { ColorSelector } from "./ColorSelector";
import { SizeSelector } from "./SizeSelector";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { buildWaLink } from "@/lib/whatsapp/waLink";
import { useCartStore } from "@/store/cartStore";
import { useTrackEvent } from "@/hooks/useTrackEvent";

interface Variant {
  id: string;
  color: string;
  size: string;
  stock: number;
}

interface PurchaseProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  promotionalPrice: number | null;
  isPromotion: boolean;
  brandName: string;
  imageUrl: string | null;
  variants: Variant[];
}

export function ProductPurchasePanel({
  product,
  whatsappNumber,
  storeName,
}: {
  product: PurchaseProduct;
  whatsappNumber: string;
  storeName: string;
}) {
  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants],
  );
  const allSizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants],
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const track = useTrackEvent();

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );

  const disabledSizes = new Set(
    allSizes.filter((size) => {
      const variant = product.variants.find(
        (v) => v.color === selectedColor && v.size === size,
      );
      return !variant || variant.stock <= 0;
    }),
  );

  const canAddToCart = Boolean(selectedVariant && selectedVariant.stock > 0);
  const unitPrice = product.isPromotion && product.promotionalPrice
    ? product.promotionalPrice
    : product.price;

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: product.imageUrl,
      color: selectedVariant.color,
      size: selectedVariant.size,
      quantity,
      unitPrice,
    });
    track("add_to_cart", {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waMessage = `Olá, ${storeName}! Tenho interesse no ${product.name}${
    selectedColor ? ` (cor ${selectedColor}${selectedSize ? `, tamanho ${selectedSize}` : ""})` : ""
  }.`;
  const waLink = buildWaLink(whatsappNumber, waMessage);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-jetta-metal uppercase">{product.brandName}</p>
        <h1 className="font-display text-2xl font-bold text-jetta-ice">{product.name}</h1>
        <div className="mt-2 flex items-baseline gap-2">
          {product.isPromotion && product.promotionalPrice ? (
            <>
              <span className="font-display text-2xl font-bold text-jetta-cyan-text">
                {formatCurrency(product.promotionalPrice)}
              </span>
              <span className="text-sm text-jetta-metal line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="font-display text-2xl font-bold text-jetta-ice">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-jetta-metal">{product.shortDescription}</p>

      {colors.length > 0 && (
        <ColorSelector colors={colors} selected={selectedColor} onSelect={handleColorSelect} />
      )}
      <SizeSelector
        sizes={allSizes}
        selected={selectedSize}
        disabledSizes={disabledSizes}
        onSelect={setSelectedSize}
      />

      {selectedVariant && (
        <p
          className={cn(
            "text-xs",
            selectedVariant.stock > 0 ? "text-jetta-cyan-text" : "text-jetta-red-text",
          )}
        >
          {selectedVariant.stock > 0
            ? `${selectedVariant.stock} em estoque`
            : "Sem estoque nesta numeração"}
        </p>
      )}

      <div className="flex items-center rounded-full border border-jetta-metal/30 w-fit">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Diminuir quantidade"
          className="flex h-11 w-11 items-center justify-center text-jetta-ice"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm text-jetta-ice" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          aria-label="Aumentar quantidade"
          className="flex h-11 w-11 items-center justify-center text-jetta-ice"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
          className="flex-1"
        >
          {added ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
        </Button>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="whatsapp" size="lg" className="w-full">
            Comprar pelo WhatsApp
          </Button>
        </a>
      </div>

      {!selectedSize && (
        <p className="text-xs text-jetta-metal">
          Selecione a numeração para adicionar ao carrinho.
        </p>
      )}
    </div>
  );
}
