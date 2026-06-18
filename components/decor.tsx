/**
 * Inline decorative SVGs — Pichwai / Nathdwara heritage motifs.
 * Pure SVG so the site looks finished before any real photos are added.
 * All are decorative => aria-hidden.
 */
import { cn } from "@/lib/utils";

/* ── Thin centered gold flourish divider (above section titles) ── */
export function Flourish({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 24"
      className={cn("h-5 w-[180px] text-gold", className)}
      fill="none"
    >
      <path
        d="M2 12h70"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M218 12h-70"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M84 12c0-6 5-9 10-9s9 3 9 8c0 3-2 5-4 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M136 12c0-6-5-9-10-9s-9 3-9 8c0 3 2 5 4 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="110" cy="12" r="4" fill="currentColor" />
      <circle cx="110" cy="12" r="7.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ── Small uppercase letter-spaced gold eyebrow label ── */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark",
        className
      )}
    >
      <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
      {children}
      <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
    </span>
  );
}

/* ── Peacock feather (corner watermark + hero accent) ── */
export function PeacockFeather({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 320"
      className={cn("text-gold", className)}
      fill="none"
    >
      <path
        d="M60 320C60 220 58 150 60 110"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="60"
        cy="78"
        rx="34"
        ry="58"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.85"
      />
      <ellipse cx="60" cy="86" rx="20" ry="34" fill="#1E4A3C" opacity="0.55" />
      <ellipse cx="60" cy="80" rx="12" ry="20" fill="#C7A24A" opacity="0.9" />
      <ellipse cx="60" cy="80" rx="6" ry="11" fill="#1E4A3C" />
      {Array.from({ length: 11 }).map((_, i) => {
        const a = (-50 + i * 10) * (Math.PI / 180);
        const x = 60 + Math.sin(a) * 40;
        const y = 30 - Math.cos(a) * 8;
        return (
          <line
            key={i}
            x1="60"
            y1="40"
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}

/* ── Hanging temple bells (hero edge) ── */
export function HangingBells({ className }: { className?: string }) {
  const bell = (cx: number, len: number, delay: string) => (
    <g style={{ transformOrigin: `${cx}px 0px`, animationDelay: delay }} className="origin-top animate-sway">
      <line x1={cx} y1="0" x2={cx} y2={len} stroke="currentColor" strokeWidth="1.4" />
      <path
        d={`M${cx - 11} ${len + 22}c0-12 5-22 11-22s11 10 11 22z`}
        fill="currentColor"
        opacity="0.92"
      />
      <rect x={cx - 13} y={len + 21} width="26" height="4" rx="2" fill="currentColor" />
      <circle cx={cx} cy={len + 29} r="3.4" fill="currentColor" />
    </g>
  );
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 150"
      className={cn("text-gold", className)}
      fill="none"
    >
      {bell(26, 30, "0s")}
      {bell(60, 52, "0.6s")}
      {bell(94, 24, "1.1s")}
    </svg>
  );
}

/* ── Toran (decorative hanging arch / festoon) ── */
export function Toran({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={cn("text-gold", className)}
      fill="none"
    >
      <path d="M0 2h400" stroke="currentColor" strokeWidth="1.2" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 12 + i * 25;
        return (
          <g key={i}>
            <path
              d={`M${x - 9} 2c0 12 4 20 9 20s9-8 9-20`}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.8"
            />
            <circle cx={x} cy="26" r="2.4" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Temple line-art watermark (section corners) ── */
export function TempleLineArt({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={cn("text-gold", className)}
      fill="none"
    >
      <path
        d="M100 12l16 26h-32zM60 60h80v8H60zM66 68v92m12-92v92m22-92v92m22-92v92m12-92v92M50 160h100v10H50zM44 172h112v8H44z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M100 38v22" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="30" r="3" fill="currentColor" />
    </svg>
  );
}

/* ── Krishna illustration (green CTA / highlight band) ── */
export function KrishnaIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 280"
      className={cn(className)}
      fill="none"
    >
      {/* peacock-feather crown */}
      <path d="M100 22c-6-14 4-20 10-14M100 22c6-14 18-14 16-4" stroke="#C7A24A" strokeWidth="2" />
      <ellipse cx="118" cy="14" rx="5" ry="8" fill="#C7A24A" opacity="0.8" />
      <ellipse cx="118" cy="14" rx="2" ry="3.5" fill="#1E4A3C" />
      {/* head */}
      <circle cx="100" cy="54" r="26" fill="#E0C77E" />
      <path d="M74 50c0-18 12-30 26-30s26 12 26 30" fill="#163528" />
      {/* face crescent */}
      <circle cx="92" cy="56" r="2.4" fill="#163528" />
      <circle cx="108" cy="56" r="2.4" fill="#163528" />
      <path d="M94 66c4 3 8 3 12 0" stroke="#163528" strokeWidth="1.6" strokeLinecap="round" />
      {/* dhoti / body */}
      <path d="M70 96c8-10 52-10 60 0l8 120H62z" fill="#C7A24A" />
      <path d="M70 96c8-10 52-10 60 0l4 60H66z" fill="#E0C77E" opacity="0.9" />
      {/* flute */}
      <line x1="48" y1="120" x2="150" y2="150" stroke="#A8842F" strokeWidth="4" strokeLinecap="round" />
      <circle cx="78" cy="129" r="1.6" fill="#163528" />
      <circle cx="92" cy="133" r="1.6" fill="#163528" />
      <circle cx="106" cy="137" r="1.6" fill="#163528" />
    </svg>
  );
}

/* ── Logo feather/leaf mark (next to wordmark) ── */
export function FeatherMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={cn("text-gold", className)}
      fill="none"
    >
      <path
        d="M24 6c10 6 14 16 8 28-2 4-6 7-8 8-2-1-6-4-8-8-6-12-2-22 8-28z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M24 10v30" stroke="currentColor" strokeWidth="1.4" />
      {[14, 20, 26, 32].map((y) => (
        <g key={y}>
          <path d={`M24 ${y}l-7 ${y / 4 - 2}`} stroke="currentColor" strokeWidth="1" />
          <path d={`M24 ${y}l7 ${y / 4 - 2}`} stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/* ── Lotus accent (small dividers / footer) ── */
export function Lotus({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 40"
      className={cn("text-gold", className)}
      fill="none"
    >
      <path d="M32 36c-2-12-2-22 0-30 2 8 2 18 0 30z" fill="currentColor" opacity="0.9" />
      <path d="M32 36c-8-8-12-16-12-24 6 4 10 12 12 24z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M32 36c8-8 12-16 12-24-6 4-10 12-12 24z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M32 36c-12-4-18-10-22-18 8 0 16 6 22 18z" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <path d="M32 36c12-4 18-10 22-18-8 0-16 6-22 18z" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}
