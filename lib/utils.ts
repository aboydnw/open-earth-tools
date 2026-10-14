import { Tool } from './types';

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

/** Reduce a URL to a comparable key: no scheme, no `www.`, no trailing slash, no fragment. */
export function normalizeUrl(url: string): string {
  const { hostname, pathname, search } = new URL(url);
  return `${hostname.toLowerCase().replace(/^www\./, '')}${pathname.replace(/\/+$/, '')}${search}`;
}

/** Unique categories across the given tools, sorted. */
export function listCategories(tools: Tool[]): string[] {
  return [...new Set(tools.map(tool => tool.category))].sort();
}
