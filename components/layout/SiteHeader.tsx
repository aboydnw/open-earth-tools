export const REPO_URL = 'https://github.com/aboydnw/open-earth-tools';

interface SiteHeaderProps {
  /** Opens the suggest-a-tool form. The button is hidden when not set. */
  onSuggest?: () => void;
}

/** Top navigation bar with the wordmark and section links. */
export function SiteHeader({ onSuggest }: SiteHeaderProps) {
  return (
    <header className="border-b border-rule bg-paper">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8"
      >
        <a href="#top" className="flex items-center gap-3 text-ink no-underline hover:text-ink">
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="15" cy="15" r="13.5" fill="none" stroke="#1E2427" strokeWidth="1.5" />
            <path d="M5 17 C9 10 14 22 19 13 S25 12 26 14" fill="none" stroke="#1E2427" strokeWidth="1.5" />
            <path d="M7 22 C11 17 16 26 22 19" fill="none" stroke="#B4532A" strokeWidth="1.5" />
          </svg>
          <span className="text-[17px] font-[650] tracking-[-0.01em]" style={{ fontStretch: '115%' }}>
            Open Earth Tools
          </span>
        </a>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[15px]">
          <a className="text-ink no-underline" href="#directory">Directory</a>
          <a className="text-ink no-underline" href="#method">How we score</a>
          <a className="text-ink no-underline" href="#libraries">Build your own</a>
          <a className="text-ink no-underline" href={REPO_URL}>GitHub</a>
          {onSuggest && (
            <button type="button" onClick={onSuggest} className="btn-secondary min-h-[40px] px-4">
              Suggest a tool
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
