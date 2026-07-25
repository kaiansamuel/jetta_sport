import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildWaLink } from "@/lib/whatsapp/waLink";
import { CircuitLines } from "@/components/decor/CircuitLines";
import { ParticleField } from "@/components/decor/ParticleField";
import { GlowRings } from "@/components/decor/GlowRings";

export function HeroShowcase({
  storeName,
  whatsappNumber,
}: {
  storeName: string;
  whatsappNumber: string;
}) {
  const waLink = buildWaLink(
    whatsappNumber,
    `Olá, ${storeName}! Quero saber mais sobre a coleção.`,
  );

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      <Image
        src="/images/hero-background.png"
        alt=""
        fill
        priority
        className="object-cover opacity-60 [html[data-theme=light]_&]:opacity-100"
      />
      {/* Dark scrim for text legibility over the photo — only makes sense
          against a dark theme background; jetta-black flips to a light hex
          in light mode, so at opacity>0 it washes the image pale instead of
          darkening it. Zeroed out there per explicit product decision. */}
      <div className="absolute inset-0 bg-gradient-to-t from-jetta-black via-jetta-black/70 to-jetta-black/40 [html[data-theme=light]_&]:opacity-0" />
      <CircuitLines className="text-jetta-blue opacity-70" />
      <GlowRings />
      <ParticleField />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
        <span className="text-xs font-semibold tracking-[0.3em] text-jetta-gold uppercase">
          Novidades 2026
        </span>
        <h1 className="font-display text-4xl leading-tight font-bold text-jetta-on-accent-light sm:text-5xl lg:text-6xl">
          O próximo nível começa nos seus pés.
        </h1>
        <p className="max-w-xl text-jetta-on-accent-light/70">
          Tênis selecionados para quem busca estilo, desempenho e presença.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/catalogo">
            <Button variant="primary" size="lg">
              Explorar coleção
            </Button>
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg">
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
