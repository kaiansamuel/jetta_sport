// Decorative, non-interactive circuit-trace background pattern. Pure SVG
// (no animation) so it's cheap to render behind hero/category sections per
// PRD §6.1's "circuitos digitais" visual reference.
export function CircuitLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="circuit-pattern"
          width="220"
          height="220"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 40 H70 V90 H140" />
            <path d="M220 30 H160 V70 H100 V140" />
            <path d="M20 220 V160 H90 V120" />
            <path d="M180 220 V180 H130 V150 H60" />
            <path d="M0 190 H40" />
          </g>
          <g fill="currentColor">
            <circle cx="70" cy="40" r="2.5" />
            <circle cx="140" cy="90" r="2.5" />
            <circle cx="100" cy="70" r="2.5" />
            <circle cx="90" cy="160" r="2.5" />
            <circle cx="130" cy="180" r="2.5" />
            <circle cx="60" cy="150" r="2.5" />
          </g>
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#circuit-pattern)"
        className="text-jetta-blue/15"
      />
    </svg>
  );
}
