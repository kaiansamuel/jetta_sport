import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-jetta-metal/15 bg-jetta-graphite/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        className,
      )}
      {...props}
    />
  );
}
