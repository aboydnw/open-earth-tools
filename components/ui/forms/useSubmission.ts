import { useCallback, useState } from 'react';

export interface SubmissionState {
  loading: boolean;
  error: string | null;
  /** True once the pull request has been opened. */
  submitted: boolean;
  /** Link to the pull request, when the repository is public. */
  prUrl: string | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  /** Pass to TurnstileWidget; changes after each failed attempt because tokens are single-use. */
  resetKey: number;
  submit: (url: string, method: 'POST' | 'PUT' | 'DELETE', body: object) => Promise<void>;
}

/** Shared state for the forms that send an add, edit, or delete submission to the API. */
export function useSubmission(): SubmissionState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const submit = useCallback(
    async (url: string, method: 'POST' | 'PUT' | 'DELETE', body: object) => {
      if (!token) {
        setError('Please complete the verification check.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...body, turnstileToken: token }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || 'Submission failed');
        }
        setPrUrl(result.prUrl ?? null);
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setToken(null);
        setResetKey((key) => key + 1);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { loading, error, submitted, prUrl, token, setToken, setError, resetKey, submit };
}
