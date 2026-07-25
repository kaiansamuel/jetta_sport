"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

// text-jetta-on-accent-{dark,light} (not text-jetta-black/ice) on all
// variants below — these buttons keep the same accent background in both
// themes, so their text must stay fixed too instead of flipping with the
// page surface theme.
const variants = {
  primary:
    "bg-jetta-blue text-jetta-on-accent-dark hover:bg-jetta-cyan focus-visible:outline-jetta-cyan",
  gold: "bg-jetta-gold text-jetta-on-accent-dark hover:bg-jetta-gold-light focus-visible:outline-jetta-gold-light",
  // hover:brightness (not hover:bg-jetta-red) — switching flatly to
  // jetta-red drops on-accent-light-on-red contrast to ~3.3:1, under WCAG
  // AA (4.5:1) for normal text. Brightening the wine background instead
  // keeps text readable while still giving a clear hover reaction.
  whatsapp:
    "bg-jetta-wine text-jetta-on-accent-light hover:brightness-110 focus-visible:outline-jetta-red",
  ghost:
    "bg-transparent text-jetta-ice border border-jetta-metal/40 hover:border-jetta-blue hover:text-jetta-blue focus-visible:outline-jetta-blue",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {/* Light-sweep — plays on its own continuous loop (not hover-gated)
            so buttons read as "alive" like the rest of the page's motion
            language, instead of only reacting on interaction. Respects
            prefers-reduced-motion via the app-wide MotionConfig. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
        />
        <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";
