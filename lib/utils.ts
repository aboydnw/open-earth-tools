import { Tool } from './types';

// Note: Most filtering functions moved to client-side components
// Keeping this file minimal with only actively used utilities

export function getToolsByOpennessLevel(tools: Tool[]): Record<string, Tool[]> {
  const grouped: Record<string, Tool[]> = {};
  
  tools.forEach(tool => {
    const level = tool.openness.level;
    if (!grouped[level]) {
      grouped[level] = [];
    }
    grouped[level].push(tool);
  });
  
  return grouped;
}

// Helper function for formatting tool IDs
export function generateIdFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}