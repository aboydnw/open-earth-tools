"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toolRepository } from '../lib/repository';
import { Tool } from '../lib/types';
import { devLog } from '../lib/env-utils';
import { 
  PageHeader, 
  ToolFilters, 
  ToolCard, 
  ToolModal,
  AboutSection,
  StatsSection,
  Footer,
  EnvDebugInfo,
  ErrorBoundary,
  ToolGridSkeleton
} from '../components';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOpenness, setSelectedOpenness] = useState("All");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        devLog('🚀 Loading tools from database...');
        
        // Load tools and categories in parallel using the repository
        const [toolsData, categoriesData] = await Promise.all([
          toolRepository.getTools(),
          toolRepository.getCategories()
        ]);
        
        devLog('✅ Successfully loaded:', {
          tools: toolsData.length,
          categories: categoriesData.length,
          sampleTool: toolsData[0]
        });
        
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

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const categoryMatch = selectedCategory === "All" || tool.category === selectedCategory;
      const opennessMatch = selectedOpenness === "All" || tool.openness.level === selectedOpenness;
      return categoryMatch && opennessMatch;
    });
  }, [tools, selectedCategory, selectedOpenness]);

  const handleOpenModal = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader />
          <EnvDebugInfo />
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
          
          <EnvDebugInfo />
          
          <AboutSection />
          
          {/* Conditional success banner - only show when data loaded successfully */}
          {tools.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-400 text-xl mr-3">✅</div>
                <div>
                  <h3 className="text-green-800 font-medium">Connected to Database</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Successfully loaded {tools.length} tools from Supabase with full openness assessments.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <StatsSection tools={tools} />

          <ToolFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedOpenness={selectedOpenness}
            onCategoryChange={setSelectedCategory}
            onOpennessChange={setSelectedOpenness}
            toolCount={filteredTools.length}
          />

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
              {filteredTools.map((tool) => (
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
                  />
                </ErrorBoundary>
              ))}
            </div>
          </ErrorBoundary>

          {filteredTools.length === 0 && tools.length > 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more tools.
              </p>
            </div>
          )}

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
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
