import { SearchBar } from '@/components/ui/forms/SearchBar';
import { FilterDropdown } from '@/components/ui/forms/FilterDropdown';
import { SimpleFilters } from '@/hooks/useToolFiltering';

interface FiltersSectionProps {
  searchTerm: string;
  filters: SimpleFilters;
  sortOption: string;
  categories: string[];
  onSearch: (term: string) => void;
  onFilterChange: (filterType: keyof SimpleFilters, value: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  toolCount: number;
  totalCount: number;
}

export function FiltersSection({
  searchTerm,
  filters,
  sortOption,
  categories,
  onSearch,
  onFilterChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  toolCount,
  totalCount
}: FiltersSectionProps) {
  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));
  
  const opennessOptions = [
    { value: 'All', label: 'All Levels' },
    { value: 'Fully Open', label: 'Fully Open' },
    { value: 'Mostly Open', label: 'Mostly Open' },
    { value: 'Partially Open', label: 'Partially Open' },
    { value: 'Minimally Open', label: 'Minimally Open' }
  ];

  const embedOptions = [
    { value: 'All', label: 'All Tools' },
    { value: 'Embeddable', label: 'Embeddable Only' },
    { value: 'Non-Embeddable', label: 'Non-Embeddable Only' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'openness-desc', label: 'Openness Score (High to Low)' },
    { value: 'openness-asc', label: 'Openness Score (Low to High)' },
    { value: 'recent', label: 'Recently Added' }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <SearchBar 
        onSearch={onSearch}
        placeholder="Search tools by name, description, organization, or features..."
        className="w-full"
      />

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterDropdown
          label="Category"
          value={filters.category}
          onChange={(value) => onFilterChange('category', value)}
          options={categoryOptions}
        />

        <FilterDropdown
          label="Openness Level"
          value={filters.opennessLevel}
          onChange={(value) => onFilterChange('opennessLevel', value)}
          options={opennessOptions}
        />

        <FilterDropdown
          label="Embed Support"
          value={filters.embedSupported}
          onChange={(value) => onFilterChange('embedSupported', value)}
          options={embedOptions}
        />

        <FilterDropdown
          label="Sort By"
          value={sortOption}
          onChange={onSortChange}
          options={sortOptions}
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {toolCount} of {totalCount} tools
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-ds-orange-600 hover:text-ds-orange-700"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
