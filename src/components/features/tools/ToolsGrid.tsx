import { Tool } from '@/types';
import { ToolCard } from './ToolCard';
import { ErrorBoundary } from '@/components/state/ErrorBoundary';
import { EmptyState } from '@/components/state/EmptyState';

interface ToolsGridProps {
  tools: Tool[];
  onOpenModal: (tool: Tool) => void;
  onGenerateEmbed: (tool: Tool) => void;
  onClearFilters: () => void;
}

const GridErrorFallback = () => (
  <div className="text-center py-12">
    <div className="text-red-400 text-6xl mb-4">⚠️</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tools</h3>
    <p className="text-gray-600 mb-4">
      There was an error displaying the tools grid. Please try refreshing.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
    >
      Refresh Page
    </button>
  </div>
);

const ToolCardErrorFallback = () => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="text-red-400 text-xl mb-2">⚠️</div>
    <h4 className="text-red-800 font-medium mb-1">Error loading tool</h4>
    <p className="text-red-600 text-sm">This tool card failed to load.</p>
  </div>
);

export function ToolsGrid({ tools, onOpenModal, onGenerateEmbed, onClearFilters }: ToolsGridProps) {
  if (tools.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <ErrorBoundary fallback={<GridErrorFallback />}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool) => (
          <ErrorBoundary key={tool.id} fallback={<ToolCardErrorFallback />}>
            <ToolCard
              tool={tool}
              onOpenModal={onOpenModal}
              onGenerateEmbed={onGenerateEmbed}
            />
          </ErrorBoundary>
        ))}
      </div>
    </ErrorBoundary>
  );
}
