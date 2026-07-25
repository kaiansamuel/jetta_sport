import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  new: "bg-jetta-blue/15 text-jetta-cyan border-jetta-blue/40",
  promotion: "bg-jetta-wine/20 text-jetta-red border-jetta-wine/50",
  featured: "bg-jetta-gold/15 text-jetta-gold-light border-jetta-gold/40",
  neutral: "bg-jetta-graphite text-jetta-metal border-jetta-metal/30",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
