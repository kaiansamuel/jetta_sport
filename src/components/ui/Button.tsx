import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-jetta-blue text-jetta-black hover:bg-jetta-cyan focus-visible:outline-jetta-cyan",
  gold: "bg-jetta-gold text-jetta-black hover:bg-jetta-gold-light focus-visible:outline-jetta-gold-light",
  // hover:brightness (not hover:bg-jetta-red) — switching flatly to
  // jetta-red drops ice-on-red contrast to ~3.3:1, under WCAG AA (4.5:1)
  // for normal text. Brightening the wine background instead keeps text
  // readable while still giving a clear hover reaction.
  whatsapp:
    "bg-jetta-wine text-jetta-ice hover:brightness-110 focus-visible:outline-jetta-red",
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
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
