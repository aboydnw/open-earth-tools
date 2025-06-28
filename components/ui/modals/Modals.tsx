import { Tool } from '@/types';
import { ToolModal } from './ToolModal';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import { ErrorBoundary } from '@/components/state/ErrorBoundary';

interface ModalsProps {
  selectedTool: Tool | null;
  selectedToolForEmbed: Tool | null;
  showEmbedGenerator: boolean;
  onCloseModal: () => void;
  onCloseEmbedGenerator: () => void;
}

const ModalErrorFallback = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 max-w-md">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tool details</h3>
      <p className="text-gray-600 mb-4">Unable to display tool information.</p>
      <button 
        onClick={onClose}
        className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);

export function Modals({ 
  selectedTool, 
  selectedToolForEmbed, 
  showEmbedGenerator, 
  onCloseModal, 
  onCloseEmbedGenerator 
}: ModalsProps) {
  return (
    <>
      {/* Tool Modal */}
      {selectedTool && (
        <ErrorBoundary fallback={<ModalErrorFallback onClose={onCloseModal} />}>
          <ToolModal
            tool={selectedTool}
            isOpen={!!selectedTool}
            onClose={onCloseModal}
          />
        </ErrorBoundary>
      )}

      {/* Embed Code Generator Modal */}
      {selectedToolForEmbed && (
        <EmbedCodeGenerator
          tool={selectedToolForEmbed}
          isOpen={showEmbedGenerator}
          onClose={onCloseEmbedGenerator}
        />
      )}
    </>
  );
}
