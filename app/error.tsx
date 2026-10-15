'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="text-center max-w-md mx-auto">
        <h1 className="font-wide mb-2 text-3xl font-[520] tracking-[-0.02em]">Something went wrong</h1>
        <p className="mb-6 text-slate">
          {error.message || 'An unexpected error occurred while loading the page.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
          <a 
            href="/"
            className="btn-secondary"
          >
            Return Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="mt-4 font-mono text-xs text-graphite">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}