"use client";

import { motion } from "framer-motion";

// Fixed positions/delays (not Math.random()) so server and client render
// identically — random values generated per-render would mismatch during
// hydration. Framer Motion already respects prefers-reduced-motion here via
// the app-wide <MotionConfig reducedMotion="user"> in the root layout.
const PARTICLES = [
  { left: "8%", top: "20%", size: 3, delay: 0, duration: 7 },
  { left: "18%", top: "65%", size: 2, delay: 0.8, duration: 8 },
  { left: "27%", top: "35%", size: 4, delay: 1.6, duration: 6.5 },
  { left: "38%", top: "80%", size: 2, delay: 0.4, duration: 7.5 },
  { left: "47%", top: "15%", size: 3, delay: 2.2, duration: 9 },
  { left: "58%", top: "55%", size: 2, delay: 1.2, duration: 6 },
  { left: "67%", top: "25%", size: 4, delay: 0.2, duration: 8.5 },
  { left: "76%", top: "70%", size: 3, delay: 1.8, duration: 7 },
  { left: "85%", top: "40%", size: 2, delay: 2.6, duration: 6.8 },
  { left: "93%", top: "18%", size: 3, delay: 0.6, duration: 7.8 },
  { left: "14%", top: "90%", size: 2, delay: 1.4, duration: 8.2 },
  { left: "62%", top: "88%", size: 3, delay: 2, duration: 7.2 },
] as const;

export function ParticleField({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-jetta-gold-light"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            boxShadow: "0 0 8px 2px rgba(255, 217, 120, 0.6)",
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.15, 0.9, 0.15],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
