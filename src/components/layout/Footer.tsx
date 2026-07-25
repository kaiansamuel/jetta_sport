"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const FOOTER_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/lancamentos", label: "Lançamentos" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/marcas", label: "Marcas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/trocas", label: "Política de troca" },
  { href: "/privacidade", label: "Privacidade" },
];

export function Footer({
  storeName,
  instagramUrl,
  address,
  businessHours,
}: {
  storeName: string;
  instagramUrl?: string | null;
  address?: string | null;
  businessHours?: string | null;
}) {
  const track = useTrackEvent();

  return (
    <footer className="mt-auto border-t border-jetta-metal/15 bg-jetta-graphite/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <span className="font-display text-sm font-bold tracking-widest text-jetta-ice uppercase">
            {storeName}
          </span>
          <p className="mt-3 text-sm text-jetta-metal">
            Tênis selecionados para quem busca estilo, desempenho e presença.
          </p>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("instagram_click", { source: "footer" })}
              className="mt-4 inline-flex items-center gap-2 text-sm text-jetta-metal hover:text-jetta-blue"
            >
              <ExternalLink className="h-4 w-4" />
              Instagram
            </a>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wide text-jetta-metal uppercase">
            Navegação
          </p>
          <ul className="mt-3 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-jetta-metal hover:text-jetta-blue"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wide text-jetta-metal uppercase">
            Atendimento
          </p>
          {address && <p className="mt-3 text-sm text-jetta-metal">{address}</p>}
          {businessHours && (
            <p className="mt-1 text-sm text-jetta-metal">{businessHours}</p>
          )}
        </div>
      </div>

      <div className="border-t border-jetta-metal/10 px-4 py-4 text-center text-xs text-jetta-metal sm:px-6">
        © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
