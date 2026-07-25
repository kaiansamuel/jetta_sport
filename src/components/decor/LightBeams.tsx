"use client";

import { motion } from "framer-motion";

// Fixed positions/delays (not Math.random()) so server and client render
// identically — same rationale as ParticleField. Colors reference the
// jetta-blue/jetta-cyan CSS vars directly (not Tailwind color classes)
// since those tokens stay fixed across light/dark theme, unlike jetta-black.
// Respects prefers-reduced-motion via the app-wide <MotionConfig
// reducedMotion="user"> in the root layout.
const BEAMS = [
  { left: "6%", width: 1.5, delay: 0, duration: 5.5, color: "var(--jetta-blue)" },
  { left: "18%", width: 2, delay: 2.2, duration: 7, color: "var(--jetta-cyan)" },
  { left: "34%", width: 1.5, delay: 1, duration: 6, color: "var(--jetta-blue)" },
  { left: "50%", width: 2, delay: 3.4, duration: 8, color: "var(--jetta-cyan)" },
  { left: "66%", width: 1.5, delay: 0.6, duration: 5.8, color: "var(--jetta-blue)" },
  { left: "82%", width: 2, delay: 2.8, duration: 6.6, color: "var(--jetta-cyan)" },
  { left: "94%", width: 1.5, delay: 1.6, duration: 7.4, color: "var(--jetta-blue)" },
] as const;

export function LightBeams() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden mix-blend-screen"
    >
      {BEAMS.map((beam, index) => (
        <motion.span
          key={index}
          className="absolute top-0 h-1/2 rounded-full blur-[2px]"
          style={{
            left: beam.left,
            width: beam.width,
            background: `linear-gradient(to bottom, transparent, ${beam.color}, transparent)`,
            boxShadow: `0 0 8px 1px ${beam.color}`,
          }}
          initial={{ y: "-120%", opacity: 0 }}
          animate={{ y: "320%", opacity: [0, 0.45, 0.45, 0] }}
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
