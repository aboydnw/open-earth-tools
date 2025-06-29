"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { toolRepository } from '../lib/repository';
import { Tool } from '../lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { AboutSection } from '@/components/layout/AboutSection';
import { StatsSection } from '@/components/layout/StatsSection';
import { Footer } from '@/components/layout/Footer';
import { ToolCard } from '@/components/features/tools/ToolCard';
import ToolGridSkeleton from '@/components/features/tools/ToolGridSkeleton';
import { ToolModal } from '@/components/ui/modals/ToolModal';
import { ErrorBoundary } from '@/components/state/ErrorBoundary';
import { SearchBar } from '@/components/ui/forms/SearchBar';
import { EmbedCodeGenerator } from '@/components/ui/modals/EmbedCodeGenerator';
import { AddToolModal } from '@/components/ui/modals/AddToolModal';
import { DeleteConfirmationModal } from '@/components/ui/modals/DeleteConfirmationModal';
import { EditToolModal } from '@/components/ui/modals/EditToolModal';

// Simple filters interface
interface SimpleFilters {
  category: string;
  opennessLevel: string;
  embedSupported: string;
}

export default function Home() {
  // Basic data state
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SimpleFilters>({
    category: 'All',
    opennessLevel: 'All',
    embedSupported: 'All'
  });
  const [sortOption, setSortOption] = useState('name-asc');
  
  // UI state
  const [showEmbedGenerator, setShowEmbedGenerator] = useState(false);
  const [selectedToolForEmbed, setSelectedToolForEmbed] = useState<Tool | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Load tools and categories in parallel
        const [toolsData, categoriesData] = await Promise.all([
          toolRepository.getTools(),
          toolRepository.getCategories()
        ]);
        
        setTools(toolsData);
        setCategories(['All', ...categoriesData]);
        
      } catch (err) {
        console.error('❌ Failed to load data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Simple filtering and sorting logic
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

  const handleOpenModal = useCallback((tool: Tool) => {
    setSelectedTool(tool);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTool(null);
  }, []);

  const handleGenerateEmbed = useCallback((tool: Tool) => {
    setSelectedToolForEmbed(tool);
    setShowEmbedGenerator(true);
  }, []);

  const handleCloseEmbedGenerator = useCallback(() => {
    setShowEmbedGenerator(false);
    setSelectedToolForEmbed(null);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      category: 'All',
      opennessLevel: 'All',
      embedSupported: 'All'
    });
  }, []);

  const handleToolAdded = useCallback((newTool: Tool) => {
    // Add the new tool to the state
    setTools(prev => [...prev, newTool]);
    
    // Update categories if it's a new category
    if (!categories.includes(newTool.category)) {
      setCategories(prev => [...prev, newTool.category].sort());
    }
    
    // Clear any filters to show the new tool
    clearAllFilters();
  }, [categories, clearAllFilters]);

  const handleDeleteTool = useCallback((tool: Tool) => {
    setToolToDelete(tool);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!toolToDelete) return;

    try {
      const response = await fetch(`/api/tools/${toolToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tool');
      }

      // Remove the tool from state
      setTools(prev => prev.filter(tool => tool.id !== toolToDelete.id));
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setToolToDelete(null);
      
    } catch (error) {
      console.error('Failed to delete tool:', error);
      throw error; // Re-throw to let modal handle the error display
    }
  }, [toolToDelete]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setToolToDelete(null);
  }, []);

  const handleEditTool = useCallback((tool: Tool) => {
    setToolToEdit(tool);
    setShowEditModal(true);
  }, []);

  const handleToolUpdated = useCallback((updatedTool: Tool) => {
    // Update the tool in state
    setTools(prev => prev.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    ));
    
    // Update categories if it's a new category
    if (!categories.includes(updatedTool.category)) {
      setCategories(prev => [...prev, updatedTool.category].sort());
    }
    
    // Close modal and reset state
    setShowEditModal(false);
    setToolToEdit(null);
  }, [categories]);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setToolToEdit(null);
  }, []);

  // Loading state
  if (loading) {
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader />
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-red-400 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Failed to load tools</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader />
          
          <AboutSection />
          
          <StatsSection tools={tools} />

          {/* Search and Filter Interface */}
          <div className="space-y-6 mb-8">
            {/* Search Bar */}
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search tools by name, description, organization, or features..."
              className="w-full"
            />

            {/* Simple Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Openness Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Openness Level</label>
                <select
                  value={filters.opennessLevel}
                  onChange={(e) => handleFilterChange('opennessLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                >
                  <option value="All">All Levels</option>
                  <option value="Fully Open">Fully Open</option>
                  <option value="Mostly Open">Mostly Open</option>
                  <option value="Partially Open">Partially Open</option>
                  <option value="Minimally Open">Minimally Open</option>
                </select>
              </div>

              {/* Embed Support Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Embed Support</label>
                <select
                  value={filters.embedSupported}
                  onChange={(e) => handleFilterChange('embedSupported', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                >
                  <option value="All">All Tools</option>
                  <option value="Embeddable">Embeddable Only</option>
                  <option value="Non-Embeddable">Non-Embeddable Only</option>
                </select>
              </div>

              {/* Sort Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="openness-desc">Openness Score (High to Low)</option>
                  <option value="openness-asc">Openness Score (Low to High)</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>

            {/* Edit Mode Toggle */}
            <div className="flex justify-start gap-3">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  editMode
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {editMode ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Exit Edit Mode
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Mode
                  </>
                )}
              </button>

              <button
                onClick={() => setShowAddToolModal(true)}
                className="inline-flex items-center px-4 py-2 bg-ds-orange-500 text-white rounded-md text-sm font-medium hover:bg-ds-orange-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Tool
              </button>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredAndSortedTools.length} of {tools.length} tools
              </span>
              {(searchTerm || Object.values(filters).some(value => value !== 'All')) && (
                <button
                  onClick={clearAllFilters}
                  className="text-ds-orange-600 hover:text-ds-orange-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Tools Grid */}
          <ErrorBoundary fallback={
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
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredAndSortedTools.map((tool) => (
                <ErrorBoundary
                  key={tool.id}
                  fallback={
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="text-red-400 text-xl mb-2">⚠️</div>
                      <h4 className="text-red-800 font-medium mb-1">Error loading tool</h4>
                      <p className="text-red-600 text-sm">This tool card failed to load.</p>
                    </div>
                  }
                >
                  <ToolCard
                    tool={tool}
                    onOpenModal={handleOpenModal}
                    onGenerateEmbed={handleGenerateEmbed}
                    editMode={editMode}
                    onDelete={handleDeleteTool}
                    onEdit={handleEditTool}
                  />
                </ErrorBoundary>
              ))}
            </div>
          </ErrorBoundary>

          {/* No results state */}
          {filteredAndSortedTools.length === 0 && tools.length > 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to see more tools.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Tool Modal */}
          {selectedTool && (
            <ErrorBoundary
              fallback={
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tool details</h3>
                    <p className="text-gray-600 mb-4">Unable to display tool information.</p>
                    <button 
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              }
            >
              <ToolModal
                tool={selectedTool}
                isOpen={!!selectedTool}
                onClose={handleCloseModal}
              />
            </ErrorBoundary>
          )}

          {/* Embed Code Generator Modal */}
          {selectedToolForEmbed && (
            <EmbedCodeGenerator
              tool={selectedToolForEmbed}
              isOpen={showEmbedGenerator}
              onClose={handleCloseEmbedGenerator}
            />
          )}

          {/* Add Tool Modal */}
          {showAddToolModal && (
            <ErrorBoundary
              fallback={
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading add tool form</h3>
                    <p className="text-gray-600 mb-4">Unable to display the add tool modal.</p>
                    <button 
                      onClick={() => setShowAddToolModal(false)}
                      className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              }
            >
              <AddToolModal
                isOpen={showAddToolModal}
                onClose={() => setShowAddToolModal(false)}
                onToolAdded={handleToolAdded}
              />
            </ErrorBoundary>
          )}

          {/* Edit Tool Modal */}
          {showEditModal && toolToEdit && (
            <ErrorBoundary
              fallback={
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading edit form</h3>
                    <p className="text-gray-600 mb-4">Unable to display the edit tool modal.</p>
                    <button 
                      onClick={handleCloseEditModal}
                      className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              }
            >
              <EditToolModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onToolUpdated={handleToolUpdated}
                tool={toolToEdit}
              />
            </ErrorBoundary>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && toolToDelete && (
            <ErrorBoundary
              fallback={
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading delete confirmation</h3>
                    <p className="text-gray-600 mb-4">Unable to display the delete confirmation modal.</p>
                    <button 
                      onClick={handleCloseDeleteModal}
                      className="px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              }
            >
              <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                tool={toolToDelete}
              />
            </ErrorBoundary>
          )}
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
