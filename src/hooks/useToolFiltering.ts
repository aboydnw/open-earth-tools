import { useState, useMemo, useCallback } from 'react';
import { Tool } from '@/types';

export interface SimpleFilters {
  category: string;
  opennessLevel: string;
  embedSupported: string;
}

export function useToolFiltering(tools: Tool[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SimpleFilters>({
    category: 'All',
    opennessLevel: 'All',
    embedSupported: 'All'
  });
  const [sortOption, setSortOption] = useState('name-asc');

  // Filtering and sorting logic
  const filteredAndSortedTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.organization.toLowerCase().includes(searchLower) ||
          tool.features.some(feature => feature.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'All' && tool.category !== filters.category) {
        return false;
      }

      // Openness level filter
      if (filters.opennessLevel !== 'All' && tool.openness.level !== filters.opennessLevel) {
        return false;
      }

      // Embed support filter
      if (filters.embedSupported !== 'All') {
        const isEmbeddable = filters.embedSupported === 'Embeddable';
        if (tool.embedSupported !== isEmbeddable) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'openness-desc':
          return b.openness.score - a.openness.score;
        case 'openness-asc':
          return a.openness.score - b.openness.score;
        case 'recent':
          // For now, sort by name as we don't have creation dates
          return a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [tools, searchTerm, filters, sortOption]);

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilterChange = useCallback((filterType: keyof SimpleFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortOption(sort);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      category: 'All',
      opennessLevel: 'All',
      embedSupported: 'All'
    });
  }, []);

  const hasActiveFilters = searchTerm || Object.values(filters).some(value => value !== 'All');

  return {
    searchTerm,
    filters,
    sortOption,
    filteredAndSortedTools,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    clearAllFilters,
    hasActiveFilters
  };
}
