"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/format";
import { buildWaLink } from "@/lib/whatsapp/waLink";
import type { ProductListItem } from "@/lib/db/products";

export function ProductCard({
  product,
  whatsappNumber,
}: {
  product: ProductListItem;
  whatsappNumber: string;
}) {
  const [hovered, setHovered] = useState(false);
  const images = product.images;
  const activeImage = hovered && images[1] ? images[1] : images[0];

  const hasPromotion = product.isPromotion && product.promotionalPrice != null;
  const price = product.price;
  const promoPrice = product.promotionalPrice;
  const discountPct =
    hasPromotion && promoPrice ? Math.round((1 - promoPrice / price) * 100) : null;

  const inStock = product.variants.some((v) => v.stock > 0);

  const waLink = buildWaLink(
    whatsappNumber,
    `Olá! Tenho interesse no ${product.name} (${product.brand.name}).`,
  );

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-jetta-metal/15 bg-jetta-graphite/60 transition-colors hover:border-jetta-blue/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-jetta-black">
          {activeImage && (
            <Image
              src={activeImage.url}
              alt={activeImage.altText ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge variant="new">Novo</Badge>}
            {hasPromotion && <Badge variant="promotion">-{discountPct}%</Badge>}
            {product.isFeatured && <Badge variant="featured">Destaque</Badge>}
          </div>
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-jetta-black/70">
              <span className="text-xs font-semibold tracking-wide text-jetta-metal uppercase">
                Esgotado
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-jetta-metal uppercase">{product.brand.name}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-jetta-ice">
            {product.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            {hasPromotion ? (
              <>
                <span className="font-display text-base font-bold text-jetta-cyan">
                  {formatCurrency(promoPrice!)}
                </span>
                <span className="text-xs text-jetta-metal line-through">
                  {formatCurrency(price)}
                </span>
              </>
            ) : (
              <span className="font-display text-base font-bold text-jetta-ice">
                {formatCurrency(price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 px-4 pb-4">
        <Link
          href={`/produto/${product.slug}`}
          className="flex-1 rounded-full border border-jetta-metal/30 py-2 text-center text-xs font-semibold text-jetta-ice hover:border-jetta-blue hover:text-jetta-blue"
        >
          Ver detalhes
        </Link>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Falar sobre ${product.name} no WhatsApp`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-jetta-wine text-jetta-ice hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
