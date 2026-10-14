"use client";

import { useEffect, useRef, useState } from 'react';
import { Tool } from '@/types';
import { AnswerMark, ScoreBar, ThemeFill } from '@/components/survey/Symbology';
import { ANSWER_LABELS, answersFor, levelLabel, pinFor, themeOf } from '@/lib/survey';

interface ToolDetailPanelProps {
  tool: Tool;
  onClose: () => void;
}

interface ReuseOption {
  title: string;
  status: string;
  available: boolean;
  body: string;
  code?: string;
  link?: { href: string; label: string };
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Iframe snippet with a locked-down sandbox, for pasting into another page. */
export function embedSnippet(tool: Pick<Tool, 'name' | 'embedUrl'>): string {
  return [
    `<iframe src="${escapeAttribute(tool.embedUrl)}" title="${escapeAttribute(tool.name)}"`,
    '  width="100%" height="500" frameborder="0" loading="lazy"',
    '  sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-top-navigation-by-user-activation"',
    '  referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  ].join('\n');
}

function reuseOptions(tool: Tool): ReuseOption[] {
  const options: ReuseOption[] = [
    {
      title: 'Link to it',
      status: 'Works',
      available: true,
      body: 'Open the tool, set up the view you want, then share the address from your browser.',
      link: { href: tool.url, label: new URL(tool.url).hostname.replace(/^www\./, '') },
    },
    tool.embedSupported
      ? {
          title: 'Embed it',
          status: 'Embeds',
          available: true,
          body: 'Paste this into your page. The sandbox stops the tool reaching your site’s cookies or camera.',
          code: embedSnippet(tool),
        }
      : {
          title: 'Embed it',
          status: 'Link only',
          available: false,
          body: tool.embedNote || 'The publisher blocks embedding in other sites.',
        },
  ];
  if (tool.dataLink) {
    options.push({
      title: 'Get the data',
      status: 'Available',
      available: true,
      body: 'The data behind the tool is published separately.',
      link: { href: tool.dataLink, label: 'Data source' },
    });
  }
  return options;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="self-start border border-ink px-3 py-1.5 font-mono text-xs transition-colors hover:bg-ink hover:text-sheet"
    >
      {copied ? 'Copied' : 'Copy code'}
    </button>
  );
}

/** Slide-in panel with a tool's description, openness answers and ways to reuse it. */
export function ToolDetailPanel({ tool, onClose }: ToolDetailPanelProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const theme = themeOf(tool);
  const pin = pinFor(tool.name);
  const score = tool.openness.score;
  const answers = answersFor(tool);
  const reuse = reuseOptions(tool);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close details"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 animate-fade cursor-pointer bg-ink/40"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-detail-title"
        className="absolute inset-y-0 right-0 w-[min(560px,100%)] animate-drawer-in overflow-y-auto border-l border-ink bg-sheet"
      >
        <div className="relative h-[220px] overflow-hidden border-b border-ink" style={{ background: theme.bg }}>
          <ThemeFill theme={theme.key} />
          <div aria-hidden="true" className="absolute h-0 w-0" style={{ left: pin.x, top: pin.y }}>
            <span className="absolute -left-[60px] top-0 h-px w-[120px] bg-ink/50" />
            <span className="absolute -top-[60px] left-0 h-[120px] w-px bg-ink/50" />
            <span className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full bg-ink" />
          </div>
          <span className="absolute bottom-4 left-5 bg-sheet/90 px-2 py-[3px] font-mono text-[11px]">{pin.coord}</span>
          <button
            ref={closeButton}
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="absolute right-4 top-3.5 flex h-11 w-11 items-center justify-center border border-ink bg-sheet text-ink transition-colors hover:bg-ink hover:text-sheet"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-8 px-6 pb-11 pt-7 sm:px-8">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[11.5px] uppercase tracking-[.1em] text-graphite">
              {theme.label} · {tool.category}
            </p>
            <h2
              id="tool-detail-title"
              className="text-[32px] font-[560] leading-[1.1] tracking-[-0.02em] [text-wrap:balance]"
              style={{ fontStretch: '110%' }}
            >
              {tool.name}
            </h2>
            <p className="font-mono text-[13px] text-slate">{tool.organization}</p>
          </div>

          <div className="flex flex-col gap-[18px]">
            <p className="text-base leading-relaxed text-body [text-wrap:pretty]">{tool.description}</p>
            <div className="flex flex-wrap gap-2.5">
              <a className="btn-primary px-5" href={tool.url} target="_blank" rel="noopener noreferrer">
                Open tool
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 1h8v8M11 1L1 11" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </a>
            </div>
          </div>

          <section aria-labelledby="openness-heading" className="flex flex-col gap-3.5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 id="openness-heading" className="font-mono text-[11.5px] font-medium uppercase tracking-[.1em] text-graphite">
                  How open is it?
                </h3>
                <p className="flex items-baseline gap-2.5">
                  <span className="text-5xl font-medium leading-none tracking-[-0.03em]" style={{ fontStretch: '110%' }}>
                    {score}
                  </span>
                  <span className="whitespace-nowrap font-mono text-sm text-slate">/ 6 · {levelLabel(score)}</span>
                </p>
              </div>
              <span className="pb-1.5">
                <ScoreBar score={score} segmentWidth={22} segmentHeight={12} gap={3} animateFrom={200} />
              </span>
            </div>
            <ul className="border-t border-ink">
              {answers.map((a, i) => (
                <li
                  key={a.question}
                  className="grid animate-rise-fast grid-cols-[22px_minmax(0,1fr)_56px] items-start gap-x-3.5 gap-y-1 border-b border-rule py-3.5"
                  style={{ animationDelay: `${260 + i * 60}ms` }}
                >
                  <span aria-hidden="true" className="flex justify-center pt-1">
                    <AnswerMark answer={a.answer} />
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <span className="text-[15px] font-semibold">{a.question}</span>
                    <span className="text-sm leading-normal text-slate">{a.note}</span>
                  </span>
                  <span className="pt-0.5 text-right font-mono text-xs font-medium">
                    {a.answer ? ANSWER_LABELS[a.answer] : ''}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[11.5px] text-graphite">
              {tool.openness.assessedAt && <>Checked {tool.openness.assessedAt} · </>}
              <a href="#method" onClick={onClose} className="text-ink underline-offset-[3px]">How we score</a>
            </p>
          </section>

          <section aria-labelledby="reuse-heading" className="flex flex-col gap-3.5">
            <h3 id="reuse-heading" className="font-mono text-[11.5px] font-medium uppercase tracking-[.1em] text-graphite">
              Ways to reuse it
            </h3>
            <ol className="border-t border-ink">
              {reuse.map((option, i) => (
                <li key={option.title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3.5 gap-y-1 border-b border-rule py-4">
                  <span className="pt-0.5 font-mono text-xs text-rust">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-[15px] font-semibold">{option.title}</span>
                      <span className={`flex items-center gap-1.5 font-mono text-[11.5px] ${option.available ? 'text-ink' : 'text-[#5B6266]'}`}>
                        <span
                          aria-hidden="true"
                          className="h-[7px] w-[7px] border border-current"
                          style={{ background: option.available ? '#1E2427' : 'transparent' }}
                        />
                        {option.status}
                      </span>
                    </div>
                    <span className="text-sm leading-normal text-slate">{option.body}</span>
                    {option.code && (
                      <>
                        <code className="block whitespace-pre-wrap bg-ink px-3 py-2.5 font-mono text-xs leading-normal text-paper [overflow-wrap:anywhere]">
                          {option.code}
                        </code>
                        <CopyButton text={option.code} />
                      </>
                    )}
                    {option.link && (
                      <a
                        href={option.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start font-mono text-xs text-ink underline-offset-[3px]"
                      >
                        {option.link.label} ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  );
}
