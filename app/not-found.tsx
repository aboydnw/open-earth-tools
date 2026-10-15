export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-8">
      <div className="max-w-md text-center">
        <p className="marginalia mb-4">404</p>
        <h1 className="font-wide mb-2 text-3xl font-[520] tracking-[-0.02em]">Off the map</h1>
        <p className="mb-6 text-slate">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="btn-primary">
          Back to the directory
        </a>
      </div>
    </div>
  )
}
