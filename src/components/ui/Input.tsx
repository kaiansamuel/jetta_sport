import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, ...props }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error && id ? `${id}-error` : undefined}
        className={cn(
          "h-11 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 text-sm text-jetta-ice placeholder:text-jetta-metal focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50",
          error && "border-jetta-red focus:border-jetta-red",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
