/**
 * Indian line-art motifs, all inline SVG using currentColor so colour is
 * controlled by the parent. Decorative only — every motif is aria-hidden.
 * Kept as tiny vector paths (never rasters) to protect LCP on patchy 4G.
 */

type SvgProps = { className?: string };

/** Abstracted 8-point lotus in 1.5px line art. Brand mark + section glyph. */
export function LotusMark({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M32 51 C24 43 24 26 32 14 C40 26 40 43 32 51 Z" />
      <path d="M32 51 C23 47 17 35 17 23 C27 27 32 37 32 51 Z" />
      <path d="M32 51 C41 47 47 35 47 23 C37 27 32 37 32 51 Z" />
      <path d="M32 51 C19 51 11 43 9 33 C21 31 30 41 32 51 Z" />
      <path d="M32 51 C45 51 53 43 55 33 C43 31 34 41 32 51 Z" />
    </svg>
  );
}

/** Lotus that draws itself once (used for the form success state). */
export function LotusDraw({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {[
        'M32 51 C24 43 24 26 32 14 C40 26 40 43 32 51 Z',
        'M32 51 C23 47 17 35 17 23 C27 27 32 37 32 51 Z',
        'M32 51 C41 47 47 35 47 23 C37 27 32 37 32 51 Z',
        'M32 51 C19 51 11 43 9 33 C21 31 30 41 32 51 Z',
        'M32 51 C45 51 53 43 55 33 C43 31 34 41 32 51 Z',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          style={{
            strokeDasharray: 120,
            strokeDashoffset: 120,
            animation: `draw .8s ease forwards`,
            animationDelay: `${0.12 * i}s`,
          }}
        />
      ))}
    </svg>
  );
}

/** Concentric "dawn" mandala. Parent sets opacity + (optional) slow spin. */
export function MandalaRings({ className }: SvgProps) {
  const petals = Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI * 2) / 24;
    const x1 = 50 + Math.cos(a) * 38;
    const y1 = 50 + Math.sin(a) * 38;
    const x2 = 50 + Math.cos(a) * 47;
    const y2 = 50 + Math.sin(a) * 47;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.6}
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="12" />
      <circle cx="50" cy="50" r="20" />
      <circle cx="50" cy="50" r="29" />
      <circle cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="48" strokeWidth={0.4} />
      <g strokeWidth={0.5}>{petals}</g>
    </svg>
  );
}

/** A small triangular cluster of rangoli dots — used as a section divider. */
export function RangoliDivider({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 80 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="6" r="2.4" />
      <circle cx="32" cy="14" r="2.4" />
      <circle cx="48" cy="14" r="2.4" />
      <circle cx="24" cy="14" r="1.6" opacity="0.7" />
      <circle cx="56" cy="14" r="1.6" opacity="0.7" />
      <circle cx="16" cy="14" r="1.1" opacity="0.45" />
      <circle cx="64" cy="14" r="1.1" opacity="0.45" />
    </svg>
  );
}

/** Line-art icons for the three feature cards. */
export function FeatureIcon({ name, className }: SvgProps & { name: 'euro' | 'mukta' | 'lotus' }) {
  if (name === 'lotus') return <LotusMark className={className} />;

  if (name === 'mukta') {
    // An open, unbound knot (∞) — "free, not locked in".
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M20 32 C20 24 12 24 12 32 C12 40 20 40 24 34 L40 30 C44 24 52 24 52 32 C52 40 44 40 40 34 L24 30 C20 28 20 30 20 32 Z" />
      </svg>
    );
  }

  // Euro in a soft ring.
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="22" />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontSize="24"
        fontFamily="'Mulish', sans-serif"
        fill="currentColor"
        stroke="none"
      >
        €
      </text>
    </svg>
  );
}
