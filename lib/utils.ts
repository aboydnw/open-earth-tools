import { Tool } from './types';

export function filterToolsByCategory(tools: Tool[], category: string): Tool[] {
  if (category === "All") return tools;
  return tools.filter(tool => tool.category === category);
}

export function filterToolsByOpenness(tools: Tool[], opennessLevel: string): Tool[] {
  if (opennessLevel === "All") return tools;
  return tools.filter(tool => tool.openness.level === opennessLevel);
}

export function getUniqueCategories(tools: Tool[]): string[] {
  const categories = new Set(tools.map(tool => tool.category));
  return ["All", ...Array.from(categories).sort()];
}

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
