"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  whatsappLink: string;
}

export function MobileMenu({ open, onClose, links, whatsappLink }: MobileMenuProps) {
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
            aria-label="Menu de navegação"
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-xs flex-col gap-6 bg-jetta-graphite p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold tracking-widest text-jetta-ice uppercase">
                Menu
              </span>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-jetta-ice hover:text-jetta-red"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-lg px-3 py-3 text-base text-jetta-ice hover:bg-jetta-black/40 hover:text-jetta-blue"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-auto">
              <Button variant="whatsapp" className="w-full">
                Comprar pelo WhatsApp
              </Button>
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
