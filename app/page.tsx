"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toolsDb } from '../lib/database';
import { Tool } from '../lib/types';
import { 
  PageHeader, 
  ToolFilters, 
  ToolCard, 
  ToolModal,
  AboutSection,
  StatsSection,
  Footer
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
        
        console.log('🚀 Loading tools from database...');
        
        // Load tools and categories in parallel using the proper database service
        const [toolsData, categoriesData] = await Promise.all([
          toolsDb.getTools(),
          toolsDb.getCategories()
        ]);
        
        console.log('✅ Successfully loaded:', {
          tools: toolsData.length,
          categories: categoriesData.length,
          sampleTool: toolsData[0]
        });
        
        setTools(toolsData);
        setCategories(['All', ...categoriesData]);
        
      } catch (err) {
        console.error('❌ Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
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
          <AboutSection />
          
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">🔄</div>
            <div className="text-gray-600">Loading tools from database...</div>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader />
        
        <AboutSection />
        
        {/* Success banner */}
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
        
        <StatsSection tools={tools} />

        <ToolFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedOpenness={selectedOpenness}
          onCategoryChange={setSelectedCategory}
          onOpennessChange={setSelectedOpenness}
          toolCount={filteredTools.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>

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
          <ToolModal
            tool={selectedTool}
            isOpen={!!selectedTool}
            onClose={handleCloseModal}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
}
