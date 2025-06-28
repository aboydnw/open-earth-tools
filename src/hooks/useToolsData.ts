import { useState, useEffect } from 'react';
import { toolRepository } from '@/lib/repository';
import { Tool } from '@/types';

export function useToolsData() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { tools, categories, loading, error };
}
