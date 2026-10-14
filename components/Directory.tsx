"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Tool } from '@/lib/types';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Hero } from '@/components/layout/Hero';
import { MethodSection } from '@/components/layout/MethodSection';
import { LibrariesSection } from '@/components/layout/LibrariesSection';
import { Footer } from '@/components/layout/Footer';
import { ThemePatterns } from '@/components/survey/Symbology';
import { DirectoryControls, type SortOption, type ViewOption } from '@/components/features/filters/DirectoryControls';
import { ToolCard } from '@/components/features/tools/ToolCard';
import { ToolTable } from '@/components/features/tools/ToolTable';
import { ToolDetailPanel } from '@/components/features/tools/ToolDetailPanel';
import { ErrorBoundary } from '@/components/state/ErrorBoundary';
import { AddToolModal } from '@/components/ui/modals/AddToolModal';
import { DeleteConfirmationModal } from '@/components/ui/modals/DeleteConfirmationModal';
import { EditToolModal } from '@/components/ui/modals/EditToolModal';
import { PendingSuggestions } from '@/components/features/suggestions/PendingSuggestions';
import { scoreHistogram, THEME_ORDER, themeOf, type ThemeKey } from '@/lib/survey';
import type { Suggestion } from '@/lib/suggestions';

interface DirectoryProps {
  tools: Tool[];
  categories: string[];
  /** Show the add, edit and delete controls. */
  isAdmin: boolean;
  /** Suggestions waiting for review; shown to admins. */
  suggestions?: Suggestion[];
  /** Turnstile site key when public suggestions are enabled; shows the Suggest a Tool button. */
  turnstileSiteKey?: string | null;
}

function ModalFallback({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-sheet max-w-md p-6">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-slate">Something went wrong. Close this and try again.</p>
        <button type="button" onClick={onClose} className="btn-primary">Close</button>
      </div>
    </div>
  );
}

function compareTools(sort: SortOption) {
  const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name);
  switch (sort) {
    case 'open':
      return (a: Tool, b: Tool) => b.openness.score - a.openness.score || byName(a, b);
    case 'least':
      return (a: Tool, b: Tool) => a.openness.score - b.openness.score || byName(a, b);
    case 'recent':
      return (a: Tool, b: Tool) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '') || byName(a, b);
    default:
      return byName;
  }
}

export function Directory({ tools, categories, isAdmin, suggestions = [], turnstileSiteKey = null }: DirectoryProps) {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<ThemeKey | 'all'>('all');
  const [minScore, setMinScore] = useState(1);
  const [sort, setSort] = useState<SortOption>('name');
  const [view, setView] = useState<ViewOption>('cards');

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tools
      .filter(tool => {
        if (theme !== 'all' && themeOf(tool).key !== theme) return false;
        if (tool.openness.score < minScore) return false;
        if (!needle) return true;
        const haystack = [tool.name, tool.organization, tool.description, tool.category, themeOf(tool).label, ...tool.features]
          .join(' ')
          .toLowerCase();
        return haystack.includes(needle);
      })
      .sort(compareTools(sort));
  }, [tools, query, theme, minScore, sort]);

  const themeCounts = useMemo(() => {
    const counts = Object.fromEntries(THEME_ORDER.map(key => [key, 0])) as Record<ThemeKey, number>;
    for (const tool of tools) counts[themeOf(tool).key] += 1;
    return counts;
  }, [tools]);

  const histogram = useMemo(() => scoreHistogram(tools), [tools]);

  const filtered = query.trim() !== '' || theme !== 'all' || minScore > 1;

  const clearFilters = useCallback(() => {
    setQuery('');
    setTheme('all');
    setMinScore(1);
  }, []);

  const closeDetail = useCallback(() => setSelectedTool(null), []);
  const openSuggest = useCallback(() => setShowAddToolModal(true), []);
  const canSuggest = !isAdmin && Boolean(turnstileSiteKey);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-paper text-ink">
        <ThemePatterns />
        <SiteHeader onSuggest={canSuggest ? openSuggest : undefined} />
        <main>
          <Hero total={tools.length} themeCount={THEME_ORDER.length} histogram={histogram} />

          <section id="directory" aria-labelledby="directory-heading" className="mx-auto max-w-[1320px] px-4 pb-6 pt-16 sm:px-8">
            {isAdmin && (
              <div className="mb-10 flex flex-col gap-6">
                <PendingSuggestions suggestions={suggestions} />
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setEditMode(!editMode)} className="btn-secondary">
                    {editMode ? 'Exit edit mode' : 'Edit mode'}
                  </button>
                  <button type="button" onClick={() => setShowAddToolModal(true)} className="btn-primary">
                    Add tool
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="directory-heading" className="font-wide text-4xl font-[520] tracking-[-0.02em]">The directory</h2>
              <p aria-live="polite" className="font-mono text-[13px] text-slate">
                Showing <strong className="font-medium text-ink">{results.length}</strong> of {tools.length}
              </p>
            </div>

            <DirectoryControls
              query={query}
              onQuery={setQuery}
              sort={sort}
              onSort={setSort}
              view={view}
              onView={setView}
              theme={theme}
              onTheme={setTheme}
              minScore={minScore}
              onMinScore={setMinScore}
              themeCounts={themeCounts}
              total={tools.length}
              filtered={filtered}
              onClear={clearFilters}
            />
          </section>

          <section aria-label="Results" className="mx-auto max-w-[1320px] px-4 pb-24 pt-2 sm:px-8">
            <ErrorBoundary
              fallback={
                <div className="border border-dashed border-rule-strong px-6 py-14 text-center">
                  <p className="text-xl font-semibold">The results couldn’t be drawn.</p>
                  <button type="button" onClick={() => window.location.reload()} className="btn-secondary mt-4">
                    Refresh the page
                  </button>
                </div>
              }
            >
              {results.length > 0 && view === 'cards' && (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(290px,100%),1fr))] gap-5">
                  {results.map((tool, i) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      index={i}
                      onOpen={setSelectedTool}
                      editMode={isAdmin && editMode}
                      onEdit={setToolToEdit}
                      onDelete={setToolToDelete}
                    />
                  ))}
                </ul>
              )}
              {results.length > 0 && view === 'table' && <ToolTable tools={results} onOpen={setSelectedTool} />}
            </ErrorBoundary>

            {results.length === 0 && (
              <div className="flex flex-col items-center gap-3 border border-dashed border-rule-strong px-6 py-14 text-center">
                <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                  <circle cx="28" cy="28" r="26" fill="none" stroke="#A9A79E" strokeDasharray="3 4" />
                  <path d="M28 14v28M14 28h28" stroke="#1E2427" strokeWidth="1.2" />
                </svg>
                <p className="text-xl font-semibold">Nothing in this area of the map.</p>
                <p className="max-w-[420px] text-slate">
                  No tools match these filters. Try a lower minimum openness or a broader search.
                </p>
                <button type="button" onClick={clearFilters} className="btn-secondary mt-2 min-h-[44px]">
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <MethodSection />
          <LibrariesSection />
        </main>
        <Footer onSuggest={canSuggest ? openSuggest : undefined} />

        {selectedTool && (
          <ErrorBoundary fallback={<ModalFallback title="Couldn’t show this tool" onClose={closeDetail} />}>
            <ToolDetailPanel tool={selectedTool} onClose={closeDetail} />
          </ErrorBoundary>
        )}

        {showAddToolModal && (isAdmin || turnstileSiteKey) && (
          <ErrorBoundary fallback={<ModalFallback title="Couldn’t open the form" onClose={() => setShowAddToolModal(false)} />}>
            <AddToolModal
              isOpen={showAddToolModal}
              onClose={() => setShowAddToolModal(false)}
              turnstileSiteKey={isAdmin ? undefined : turnstileSiteKey ?? undefined}
            />
          </ErrorBoundary>
        )}

        {toolToEdit && isAdmin && (
          <ErrorBoundary fallback={<ModalFallback title="Couldn’t open the edit form" onClose={() => setToolToEdit(null)} />}>
            <EditToolModal
              isOpen
              onClose={() => setToolToEdit(null)}
              tool={toolToEdit}
              categories={categories.filter(category => category !== 'All')}
            />
          </ErrorBoundary>
        )}

        {toolToDelete && isAdmin && (
          <ErrorBoundary fallback={<ModalFallback title="Couldn’t open the delete check" onClose={() => setToolToDelete(null)} />}>
            <DeleteConfirmationModal isOpen onClose={() => setToolToDelete(null)} tool={toolToDelete} />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}
