import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface ApiRequestState {
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  /** Send the request; on success, reload the page data, run `onDone`, and resolve true. */
  send: (url: string, method: 'POST' | 'PUT' | 'DELETE', body?: object) => Promise<boolean>;
}

/** Shared state for forms that send a JSON request to the app's API. */
export function useApiRequest(onDone: () => void): ApiRequestState {
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
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router, onDone]
  );

  return { loading, error, setError, send };
}
