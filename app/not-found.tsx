export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-ds-orange text-white rounded-lg hover:bg-ds-dark-orange transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}