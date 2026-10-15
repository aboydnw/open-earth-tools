import type { CSSProperties } from 'react';
import { RAMP_EMPTY, segmentColors, type Answer, type Theme, type ThemeKey } from '@/lib/survey';

/** SVG pattern definitions for the theme symbology. Render once per page. */
export function ThemePatterns() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <pattern id="p-atm" width="40" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 C10 1 20 1 20 7 S30 13 40 7" fill="none" stroke="#5F7487" strokeWidth="1.2" />
        </pattern>
        <pattern id="p-water" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.4" fill="#4C7C7B" />
        </pattern>
        <pattern id="p-land" width="18" height="16" patternUnits="userSpaceOnUse">
          <path d="M2 7 L5 3 L8 7 M11 15 L14 11 L17 15" fill="none" stroke="#6C7D52" strokeWidth="1.2" />
        </pattern>
        <pattern id="p-haz" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#A2603E" strokeWidth="1.6" />
        </pattern>
        <pattern id="p-soc" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0 V14 H0" fill="none" stroke="#8F7640" strokeWidth="1" />
        </pattern>
        <pattern id="p-img" width="24" height="24" patternUnits="userSpaceOnUse">
          {[
            [0, 0, 0.55], [12, 0, 0.25], [6, 6, 0.4], [18, 6, 0.7],
            [0, 12, 0.2], [12, 12, 0.6], [6, 18, 0.3], [18, 18, 0.45],
          ].map(([x, y, opacity]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#6E6684" opacity={opacity} />
          ))}
        </pattern>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.14  0 0 0 0 0.15  0 0 0 .55 0" />
        </filter>
      </defs>
    </svg>
  );
}

/** A theme's symbol pattern filling its parent. */
export function ThemeFill({ theme, opacity = 0.6, className = '' }: { theme: ThemeKey; opacity?: number; className?: string }) {
  return (
    <svg width="100%" height="100%" aria-hidden="true" className={`absolute inset-0 block ${className}`}>
      <rect width="100%" height="100%" fill={`url(#p-${theme})`} opacity={opacity} />
    </svg>
  );
}

/** A small square swatch of a theme's symbol. */
export function ThemeSwatch({ theme, size = 18 }: { theme: Pick<Theme, 'key' | 'bg'> | null; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      className="block flex-none border border-ink/25"
      style={{ background: theme?.bg ?? '#E9E8E2' }}
    >
      {theme && <rect width={size} height={size} fill={`url(#p-${theme.key})`} />}
    </svg>
  );
}

interface ScoreBarProps {
  score: number;
  segmentWidth?: number;
  segmentHeight?: number;
  gap?: number;
  empty?: string;
  /** Animate the segments filling left to right, starting after this many ms. */
  animateFrom?: number;
}

/** Six-segment openness bar on the depth ramp. */
export function ScoreBar({ score, segmentWidth = 14, segmentHeight = 8, gap = 2, empty = RAMP_EMPTY, animateFrom }: ScoreBarProps) {
  return (
    <span className="flex" style={{ gap }} aria-hidden="true">
      {segmentColors(score, empty).map((color, i) => {
        const style: CSSProperties = { width: segmentWidth, height: segmentHeight, background: color };
        if (animateFrom !== undefined) style.animationDelay = `${animateFrom + i * 70}ms`;
        return (
          <span
            key={i}
            className={animateFrom !== undefined ? 'origin-left animate-growx' : undefined}
            style={style}
          />
        );
      })}
    </span>
  );
}

const ANSWER_FILL: Record<Answer, string> = { yes: '100%', partly: '50%', no: '0%' };

/** Square mark for one openness answer: full, half or empty. A dash when not assessed. */
export function AnswerMark({ answer, size = 14 }: { answer: Answer | null; size?: number }) {
  if (!answer) {
    return <span className="font-mono text-[13px] leading-none text-muted">–</span>;
  }
  return (
    <span className="relative overflow-hidden border-[1.5px] border-deep" style={{ width: size, height: size }}>
      <span className="absolute inset-y-0 left-0 bg-deep" style={{ width: ANSWER_FILL[answer] }} />
    </span>
  );
}
