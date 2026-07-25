"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters, type FilterOptions } from "./ProductFilters";

export function MobileFilterDrawer({ options }: { options: FilterOptions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-jetta-metal/30 px-4 py-2 text-sm text-jetta-ice lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros de produtos"
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto bg-jetta-graphite p-6 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-sm font-bold tracking-widest text-jetta-ice uppercase">
                  Filtros
                </span>
                <button
                  type="button"
                  aria-label="Fechar filtros"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-jetta-ice hover:text-jetta-red"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ProductFilters options={options} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
