"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { buildWaLink } from "@/lib/whatsapp/waLink";
import { useCartCount, useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/lancamentos", label: "Lançamentos" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/marcas", label: "Marcas" },
  { href: "/sobre", label: "Sobre" },
];

export function Header({
  storeName,
  whatsappNumber,
}: {
  storeName: string;
  whatsappNumber: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const hydrated = useCartStore((state) => state.hydrated);
  const cartCount = useCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = buildWaLink(
    whatsappNumber,
    `Olá, ${storeName}! Gostaria de mais informações sobre os produtos.`,
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-jetta-metal/15 bg-jetta-black/80 py-2 backdrop-blur-md"
            : "border-transparent bg-transparent py-4",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.jpeg"
              alt={storeName}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
            <span className="font-display text-sm font-bold tracking-widest text-jetta-ice uppercase">
              {storeName}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-jetta-metal transition-colors hover:text-jetta-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/catalogo"
              aria-label="Buscar produtos"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-jetta-ice hover:text-jetta-blue sm:flex"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label="Abrir carrinho"
              onClick={() => setCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-jetta-ice hover:text-jetta-blue"
            >
              <ShoppingBag className="h-5 w-5" />
              {hydrated && cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-jetta-blue px-1 text-[10px] font-bold text-jetta-black">
                  {cartCount}
                </span>
              )}
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button variant="whatsapp" size="sm">
                Comprar pelo WhatsApp
              </Button>
            </a>
            <button
              type="button"
              aria-label="Abrir menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-jetta-ice lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        whatsappLink={waLink}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
