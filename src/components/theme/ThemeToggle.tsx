"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "jetta-theme";

function readInitialTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Lazy initializer (not an effect + setState) — runs during the first
  // client render, by which point the theme-init script in the root layout
  // has already set data-theme, so aria-label/aria-pressed are correct
  // immediately. suppressHydrationWarning on the button covers those two
  // attributes, which legitimately differ for a returning light-mode user
  // (server never knows about localStorage).
  const [theme, setTheme] = useState<"dark" | "light">(readInitialTheme);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-pressed={theme === "light"}
      suppressHydrationWarning
      className={`relative flex h-11 w-11 items-center justify-center rounded-full text-jetta-ice hover:text-jetta-blue ${className}`}
    >
      {/* Both icons always render (identical DOM on server and client —
          no hydration mismatch possible); pure CSS driven by the
          data-theme attribute decides which is visible. Swapping which
          child renders based on client-only state, like the old
          conditional `theme === "dark" ? <Sun/> : <Moon/>`, produces a
          structural mismatch suppressHydrationWarning can't cover. */}
      <Sun className="h-5 w-5 [html[data-theme=light]_&]:hidden" />
      <Moon className="absolute hidden h-5 w-5 [html[data-theme=light]_&]:block" />
    </button>
  );
}
