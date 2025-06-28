import { PageHeader } from '@/components/layout/PageHeader';
import { AboutSection } from '@/components/layout/AboutSection';
import { ToolGridSkeleton } from '@/components/features/tools/ToolGridSkeleton';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader />
        <AboutSection />
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin text-xl mr-3">🔄</div>
            <div>
              <h3 className="text-blue-800 font-medium">Loading Tools</h3>
              <p className="text-blue-700 text-sm mt-1">
                Connecting to database and loading Earth science tools...
              </p>
            </div>
          </div>
        </div>

        <ToolGridSkeleton />
      </div>
    </div>
  );
}
