"use client";

import React, { useCallback, useState } from 'react';
import { useApiRequest } from '@/components/ui/forms/useApiRequest';
import type { Suggestion } from '@/lib/suggestions';

interface PendingSuggestionsProps {
  suggestions: Suggestion[];
}

function SuggestionRow({ suggestion }: { suggestion: Suggestion }) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const onDone = useCallback(() => setAction(null), []);
  const { loading, error, send } = useApiRequest(onDone);

  const run = (next: 'approve' | 'reject') => {
    setAction(next);
    send(`/api/admin/suggestions/${suggestion.id}`, next === 'approve' ? 'POST' : 'DELETE');
  };

  return (
    <li className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-semibold">{suggestion.name}</h3>
          <a
            href={suggestion.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-mono text-xs text-ink underline-offset-[3px]"
          >
            {suggestion.url}
          </a>
        </div>
        <p className="mt-1 text-sm text-slate">{suggestion.description}</p>
        <p className="mt-2 font-mono text-[11.5px] text-graphite">
          {suggestion.dataTypes.join(', ')} · {suggestion.functionality.join(', ')} · suggested{' '}
          {suggestion.createdAt.slice(0, 10)}
        </p>
        {error && <p className="mt-2 text-sm text-[#7A2016]">{error}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => run('approve')}
          disabled={loading}
          className="btn-primary min-h-[40px] px-4 text-sm"
        >
          {loading && action === 'approve' ? 'Approving...' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => run('reject')}
          disabled={loading}
          className="btn-secondary min-h-[40px] px-4 text-sm"
        >
          {loading && action === 'reject' ? 'Rejecting...' : 'Reject'}
        </button>
      </div>
    </li>
  );
}

/** Admin list of tools suggested by visitors, with approve and reject controls. */
export function PendingSuggestions({ suggestions }: PendingSuggestionsProps) {
  return (
    <section className="border border-ink bg-sheet p-6">
      <h2 className="font-mono text-xs font-medium uppercase tracking-[.1em] text-graphite">
        Pending suggestions ({suggestions.length})
      </h2>
      {suggestions.length === 0 ? (
        <p className="mt-2 text-sm text-slate">Nothing waiting for review.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-slate">
            Approving adds the tool with automated scoring. Check it with Edit afterwards.
          </p>
          <ul className="mt-2 divide-y divide-rule border-t border-ink">
            {suggestions.map(suggestion => (
              <SuggestionRow key={suggestion.id} suggestion={suggestion} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
