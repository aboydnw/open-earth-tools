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
    <li className="py-4 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-medium text-gray-900">{suggestion.name}</h3>
          <a
            href={suggestion.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ds-orange-600 hover:text-ds-orange-700 break-all"
          >
            {suggestion.url}
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
        <p className="text-xs text-gray-500 mt-2">
          {suggestion.dataTypes.join(', ')} · {suggestion.functionality.join(', ')} · suggested{' '}
          {suggestion.createdAt.slice(0, 10)}
        </p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => run('approve')}
          disabled={loading}
          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading && action === 'approve' ? 'Approving...' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => run('reject')}
          disabled={loading}
          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
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
    <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900">
        Pending suggestions ({suggestions.length})
      </h2>
      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-600 mt-2">Nothing waiting for review.</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mt-1">
            Approving adds the tool with automated scoring. Check it with Edit afterwards.
          </p>
          <ul className="divide-y divide-gray-200 mt-2">
            {suggestions.map(suggestion => (
              <SuggestionRow key={suggestion.id} suggestion={suggestion} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
