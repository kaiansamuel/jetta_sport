"use client";

import { motion } from "framer-motion";

// Slowly rotating luminous rings — PRD §7.2 "anéis luminosos girando".
// Respects prefers-reduced-motion via the app-wide MotionConfig.
export function GlowRings({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      <motion.div
        className="rounded-full border border-jetta-blue/25"
        style={{
          width: 520,
          height: 520,
          boxShadow: "0 0 60px 0 rgba(24, 191, 255, 0.08) inset",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 m-auto rounded-full border border-jetta-gold/20"
        style={{ width: 380, height: 380 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 m-auto rounded-full border border-jetta-cyan/15"
        style={{ width: 260, height: 260 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
