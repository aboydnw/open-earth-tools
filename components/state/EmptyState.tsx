interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search terms or filters to see more tools.
      </p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
