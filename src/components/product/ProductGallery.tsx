"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface GalleryImage {
  url: string;
  altText: string | null;
}

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = images[activeIndex] ?? images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (!active) {
    return (
      <div className="aspect-square rounded-2xl border border-jetta-metal/15 bg-jetta-graphite" />
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-jetta-metal/15 bg-jetta-black"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <Image
          src={active.url}
          alt={active.altText ?? productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-200",
            zoomed && "scale-150",
          )}
          style={
            zoomed
              ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors",
                index === activeIndex ? "border-jetta-blue" : "border-transparent",
              )}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${productName} miniatura ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
