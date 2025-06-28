"use client";

import React, { useState, useMemo } from "react";
import { tools } from '../data/tools';
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOpenness, setSelectedOpenness] = useState("All");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const categoryMatch = selectedCategory === "All" || tool.category === selectedCategory;
      const opennessMatch = selectedOpenness === "All" || tool.openness.level === selectedOpenness;
      return categoryMatch && opennessMatch;
    });
  }, [selectedCategory, selectedOpenness]);

  const handleOpenModal = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader />
        
        <AboutSection />
        
        <StatsSection />

        <ToolFilters
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

        {filteredTools.length === 0 && (
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
