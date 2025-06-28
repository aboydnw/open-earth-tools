import { categories } from '../lib/constants';

interface ToolFiltersProps {
  selectedCategory: string;
  selectedOpenness: string;
  onCategoryChange: (category: string) => void;
  onOpennessChange: (openness: string) => void;
  toolCount: number;
}

export function ToolFilters({ 
  selectedCategory, 
  selectedOpenness, 
  onCategoryChange, 
  onOpennessChange, 
  toolCount 
}: ToolFiltersProps) {
  const opennessFilters = ["All", "Fully Open", "Mostly Open", "Partially Open"];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Openness Level</label>
            <select
              value={selectedOpenness}
              onChange={(e) => onOpennessChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              {opennessFilters.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
        </div>
      </div>
    </div>
  );
}
