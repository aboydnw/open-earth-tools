import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminRequestState {
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  /** Send the request; on success, reload the page data and run `onDone`. */
  send: (url: string, method: 'POST' | 'PUT' | 'DELETE', body?: object) => Promise<void>;
}

/** Shared state for the admin forms that add, edit, or delete a tool. */
export function useAdminRequest(onDone: () => void): AdminRequestState {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (url: string, method: 'POST' | 'PUT' | 'DELETE', body?: object) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method,
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || 'Request failed');
        }
        router.refresh();
        onDone();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [router, onDone]
  );

  return { loading, error, setError, send };
}
