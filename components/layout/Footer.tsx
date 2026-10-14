import { REPO_URL } from './SiteHeader';

interface FooterProps {
  /** Opens the suggest-a-tool form. The call to action is hidden when not set. */
  onSuggest?: () => void;
}

/** Suggest-a-tool call to action and the page footer. */
export function Footer({ onSuggest }: FooterProps) {
  return (
    <>
      {onSuggest && (
        <section id="suggest" aria-labelledby="suggest-heading" className="border-b border-rule">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6 px-4 py-[72px] sm:px-8">
            <div className="flex max-w-[640px] flex-col gap-2">
              <h2 id="suggest-heading" className="font-wide text-[32px] font-[520] tracking-[-0.02em]">
                Know a tool that belongs on this map?
              </h2>
              <p className="text-[17px] text-slate">
                Send us the link. We review every suggestion and score it before it’s listed.
              </p>
            </div>
            <button type="button" onClick={onSuggest} className="btn-primary">
              Suggest a tool
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </section>
      )}
      <footer className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-4 px-4 pb-12 pt-8 font-mono text-xs text-graphite sm:px-8">
        <span>Open Earth Tools · © {new Date().getFullYear()} · Each tool is subject to its own license</span>
        <span className="flex gap-5">
          <a href={REPO_URL} className="text-ink">Source on GitHub</a>
          <a href="#method" className="text-ink">Method</a>
          {onSuggest && <a href="#suggest" className="text-ink">Suggest a tool</a>}
        </span>
      </footer>
    </>
  );
}
