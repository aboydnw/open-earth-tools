"use client";

import { useEffect, useRef } from 'react';
import { CONTOURS } from '@/components/survey/contours';
import { RAMP } from '@/lib/survey';

interface HeroProps {
  total: number;
  themeCount: number;
  /** Number of tools at each score from 1 to 6. */
  histogram: number[];
}

const LONGITUDES = ['180°', '120°W', '60°W', '0°', '60°E', '120°E', '180°'];

function formatCoord(value: number, positive: string, negative: string, width: number): string {
  return `${Math.abs(value).toFixed(2).padStart(width, '0')}° ${value >= 0 ? positive : negative}`;
}

/** Home page hero: drifting contour map, satellite swath, cursor crosshair and the openness legend. */
export function Hero({ total, themeCount, histogram }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const vertical = useRef<HTMLDivElement>(null);
  const horizontal = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section || frame.current) return;
    const rect = section.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const lat = 90 - (y / rect.height) * 180;
      const lon = -180 + (x / rect.width) * 360;
      if (vertical.current) {
        vertical.current.style.transform = `translateX(${x}px)`;
        vertical.current.style.opacity = '1';
      }
      if (horizontal.current) {
        horizontal.current.style.transform = `translateY(${y}px)`;
        horizontal.current.style.opacity = '1';
      }
      if (readout.current) {
        readout.current.textContent = `${formatCoord(lat, 'N', 'S', 5)}  ${formatCoord(lon, 'E', 'W', 6)}`;
        readout.current.style.transform = `translate(${x + 12}px, ${y + 12}px)`;
        readout.current.style.opacity = '1';
      }
    });
  };

  const handleLeave = () => {
    for (const el of [vertical.current, horizontal.current, readout.current]) {
      if (el) el.style.opacity = '0';
    }
  };

  const tallest = Math.max(1, ...histogram);

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative min-h-[640px] overflow-hidden border-b border-ink"
    >
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute -inset-5 h-[calc(100%+40px)] w-[calc(100%+40px)] animate-drift"
      >
        {CONTOURS.map(({ d, delay, index }, i) => (
          <path
            key={i}
            className={index ? 'contour index' : 'contour'}
            pathLength={1}
            style={{ animationDelay: `${delay}ms` }}
            d={d}
          />
        ))}
      </svg>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[.16] mix-blend-multiply">
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-[120px] animate-swath border-l border-rust/45 bg-rust/5"
      />
      <div ref={vertical} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-px bg-ink/35 opacity-0 transition-opacity" />
      <div ref={horizontal} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ink/35 opacity-0 transition-opacity" />
      <div
        ref={readout}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 whitespace-pre bg-ink px-[7px] py-[3px] font-mono text-[11px] tracking-[.04em] text-sheet opacity-0 transition-opacity"
      >
        00.00° N  000.00° E
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex justify-between px-4 pt-2 font-mono text-[10.5px] tracking-[.06em] text-[#5B6266] sm:px-8"
      >
        {LONGITUDES.map((label, i) => <span key={i}>{label}</span>)}
      </div>

      <div className="pointer-events-none relative mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-12 px-4 pb-[72px] pt-[120px] sm:px-8">
        <div className="pointer-events-auto max-w-[720px] animate-rise [animation-delay:300ms]">
          <p className="mb-6 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[.12em] text-graphite">
            <span className="inline-block h-2 w-2 bg-rust" />
            Field guide · {total} tools · {themeCount} themes
          </p>
          <h1 className="font-wide text-[clamp(40px,6vw,76px)] font-[520] leading-none tracking-[-0.03em] [text-wrap:balance]">
            Earth-observation tools, mapped by how open they are.
          </h1>
          <p className="mt-7 max-w-[560px] text-lg leading-[1.55] text-slate [text-wrap:pretty]">
            A curated directory of web maps and viewers for climate, hazards, oceans and land. Each one is scored on six
            dimensions of openness, so you know what you can reuse, link to or run yourself.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className="btn-primary" href="#directory">
              Browse the directory
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M7 1v12M2 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
            <a className="btn-secondary" href="#method">How we score openness</a>
          </div>
        </div>

        <figure className="pointer-events-auto m-0 w-[320px] max-w-full animate-rise border border-ink bg-sheet px-5 pb-4 pt-[18px] [animation-delay:700ms]">
          <figcaption className="flex justify-between font-mono text-[11px] uppercase tracking-[.1em] text-graphite">
            <span>Legend · Openness</span>
            <span>n = {total}</span>
          </figcaption>
          <div className="mt-4 grid h-24 grid-cols-6 items-end gap-1.5 border-b border-ink">
            {histogram.map((count, i) => (
              <div key={i} className="flex h-full flex-col items-center justify-end gap-1">
                <span className="font-mono text-[11px] text-ink">{count}</span>
                <div
                  className="w-full origin-bottom animate-grow"
                  style={{
                    height: Math.max(2, Math.round((count / tallest) * 64)),
                    background: RAMP[i],
                    animationDelay: `${900 + i * 90}ms`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-6 gap-1.5 text-center font-mono text-[11px] text-graphite">
            {[1, 2, 3, 4, 5, 6].map(n => <span key={n}>{n}</span>)}
          </div>
          <p className="mt-3 text-[13px] leading-[1.45] text-slate">Score out of 6. Darker means more open.</p>
        </figure>
      </div>
    </section>
  );
}
