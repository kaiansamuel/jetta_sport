"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Banner } from "@/generated/prisma/client";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export function PromoBanner({ banner }: { banner: Banner | null }) {
  const track = useTrackEvent();

  if (!banner) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl border border-jetta-wine/40 bg-gradient-to-br from-jetta-wine via-jetta-black to-jetta-black [html[data-theme=light]_&]:via-jetta-wine [html[data-theme=light]_&]:to-jetta-wine p-10 text-center sm:p-16"
        style={{
          backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark scrim, dark-theme only — jetta-black flips to a light hex in
            light mode, so this gradient would wash the banner pale instead
            of darkening it there. */}
        <div className="absolute inset-0 bg-gradient-to-t from-jetta-black via-jetta-black/80 to-jetta-wine/40 [html[data-theme=light]_&]:opacity-0" />
        <div className="relative flex flex-col items-center gap-4">
          <h2 className="font-display text-3xl font-bold text-jetta-ice sm:text-4xl">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="max-w-lg text-jetta-metal">{banner.subtitle}</p>
          )}
          {banner.buttonLabel && banner.buttonLink && (
            <Link
              href={banner.buttonLink}
              onClick={() => track("banner_click", { bannerId: banner.id })}
            >
              <Button variant="gold" size="lg">
                {banner.buttonLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
