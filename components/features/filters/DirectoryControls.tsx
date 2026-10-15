import { ThemeSwatch } from '@/components/survey/Symbology';
import { levelLabel, RAMP, THEME_ORDER, THEMES, type ThemeKey } from '@/lib/survey';

export type SortOption = 'name' | 'open' | 'least' | 'recent';
export type ViewOption = 'cards' | 'table';

interface DirectoryControlsProps {
  query: string;
  onQuery: (query: string) => void;
  sort: SortOption;
  onSort: (sort: SortOption) => void;
  view: ViewOption;
  onView: (view: ViewOption) => void;
  theme: ThemeKey | 'all';
  onTheme: (theme: ThemeKey | 'all') => void;
  minScore: number;
  onMinScore: (score: number) => void;
  themeCounts: Record<ThemeKey, number>;
  total: number;
  filtered: boolean;
  onClear: () => void;
}

const VIEWS: [ViewOption, string][] = [['cards', 'Cards'], ['table', 'Table']];

/** Sticky search, sort, view, theme and minimum-openness controls for the directory. */
export function DirectoryControls(props: DirectoryControlsProps) {
  const { query, onQuery, sort, onSort, view, onView, theme, onTheme, minScore, onMinScore, themeCounts, total, filtered, onClear } = props;

  const chips: { key: ThemeKey | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All themes', count: total },
    ...THEME_ORDER.map(key => ({ key, label: THEMES[key].label, count: themeCounts[key] })),
  ];

  return (
    <div className="z-10 mt-6 sm:sticky sm:top-0 flex flex-col gap-3.5 border-b border-t border-b-rule border-t-ink bg-paper py-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-[999_1_360px] flex-col gap-1.5">
          <span className="marginalia">Search</span>
          <span className="relative flex items-center">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="absolute left-3.5">
              <circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="#1E2427" strokeWidth="1.5" />
              <path d="M12 12l4.5 4.5" stroke="#1E2427" strokeWidth="1.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={event => onQuery(event.target.value)}
              placeholder="Name, organisation or topic — try “methane” or “NASA”"
              className="min-h-[48px] w-full rounded-none border border-ink bg-sheet pl-[42px] pr-4 text-base outline-none"
            />
          </span>
        </label>
        <label className="flex flex-[1_1_180px] flex-col gap-1.5">
          <span className="marginalia">Sort</span>
          <select
            value={sort}
            onChange={event => onSort(event.target.value as SortOption)}
            className="min-h-[48px] rounded-none border border-ink bg-sheet px-3 text-[15px]"
          >
            <option value="name">Name, A–Z</option>
            <option value="open">Most open first</option>
            <option value="least">Least open first</option>
            <option value="recent">Recently added</option>
          </select>
        </label>
        <div role="group" aria-label="View" className="flex min-h-[48px] border border-ink">
          {VIEWS.map(([key, label]) => {
            const on = view === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => onView(key)}
                className={`flex min-w-[88px] items-center justify-center px-4 text-sm font-[550] ${on ? 'bg-ink text-sheet' : 'bg-sheet text-ink'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div role="group" aria-label="Theme" className="flex flex-wrap gap-2">
        {chips.map(chip => {
          const on = theme === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              aria-pressed={on}
              onClick={() => onTheme(on && chip.key !== 'all' ? 'all' : chip.key)}
              className={`inline-flex min-h-[40px] items-center gap-2 border pl-2.5 pr-3.5 text-sm transition-colors hover:border-ink ${
                on ? 'border-ink bg-ink text-sheet' : 'border-rule-strong bg-sheet text-ink'
              }`}
            >
              <ThemeSwatch theme={chip.key === 'all' ? null : THEMES[chip.key]} />
              <span>{chip.label}</span>
              <span className="font-mono text-xs opacity-75">{chip.count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span id="min-openness-label" className="marginalia">Min. openness</span>
          <div role="group" aria-labelledby="min-openness-label" className="flex gap-[3px]">
            {[1, 2, 3, 4, 5, 6].map(n => {
              const inRange = n >= minScore;
              const on = n === minScore;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  aria-label={`At least ${n} of 6`}
                  onClick={() => onMinScore(n)}
                  className={`h-10 w-10 border font-mono text-[13px] transition-colors ${on ? 'border-ink' : 'border-rule-strong'}`}
                  style={{
                    background: inRange ? RAMP[n - 1] : '#F4F3EF',
                    color: inRange && n >= 4 ? '#F4F3EF' : '#1E2427',
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <span className="text-sm text-slate">
            {minScore === 1 ? 'Any score' : `${minScore}+ · ${levelLabel(minScore)}`}
          </span>
        </div>
        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="min-h-[40px] text-sm text-rust underline underline-offset-[3px]"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
