import type { OpennessLevelConfig } from './types';

export const DATA_TYPE_OPTIONS = [
  'climate', 'temperature', 'precipitation', 'weather',
  'air quality', 'emissions', 'carbon', 'water quality',
  'ocean', 'marine', 'satellite imagery', 'earthquakes',
  'disasters', 'wildfire', 'floods', 'agriculture',
  'food security', 'biodiversity', 'pollution'
] as const;

export const FUNCTIONALITY_OPTIONS = [
  'visualization', 'analysis', 'monitoring', 'tracking',
  'forecasting', 'mapping', 'reporting', 'comparison',
  'exploration', 'discovery', 'assessment', 'modeling'
] as const;

// Openness level configurations for UI styling
export const opennessLevels: Record<string, OpennessLevelConfig> = {
  "Fully Open": {
    color: "emerald",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200"
  },
  "Mostly Open": {
    color: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },
  "Partially Open": {
    color: "yellow",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200"
  },
  "Minimally Open": {
    color: "red",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  }
};
