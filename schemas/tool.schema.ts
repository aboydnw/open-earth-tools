import { z } from 'zod';

// Schema for raw tool data input
export const RawToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL format"),
  audience: z.array(z.string()).optional().default([]),
  data_type: z.array(z.string()).optional().default([]),
  functionality: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(""),
  standout_features: z.array(z.string()).optional(),
  suggested_improvements: z.array(z.string()).optional(),
  organization: z.string().optional(),
  license: z.string().optional(),
  category: z.string().optional(),
});

export type RawToolData = z.infer<typeof RawToolSchema>;

// Schema for openness score
export const OpennessScoreSchema = z.object({
  score: z.enum(["green", "yellow", "red"]),
  note: z.string(),
});

// Schema for openness assessment
export const OpennessAssessmentSchema = z.object({
  score: z.number().min(0).max(6),
  level: z.enum(["Fully Open", "Mostly Open", "Partially Open", "Minimally Open"]),
  dimensions: z.object({
    "Software Licensing": OpennessScoreSchema,
    "Data Licensing": OpennessScoreSchema,
    "Technical Accessibility": OpennessScoreSchema,
    "Data Standards": OpennessScoreSchema,
    "Infrastructure": OpennessScoreSchema,
    "Community Governance": OpennessScoreSchema,
  }),
});

// Schema for complete tool object
export const ToolSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must contain only lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Name is required"),
  organization: z.string().min(1, "Organization is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  url: z.string().url("Invalid URL format"),
  embedUrl: z.string().url("Invalid embed URL format"),
  license: z.string().min(1, "License is required"),
  category: z.string().min(1, "Category is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  icon: z.string().min(1, "Icon is required"),
  status: z.literal("Production"),
  embedSupported: z.boolean(),
  embedNote: z.string().optional(),
  openness: OpennessAssessmentSchema,
});

export type Tool = z.infer<typeof ToolSchema>;

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Import configuration schema
export const ImportConfigSchema = z.object({
  validateOnly: z.boolean().default(false),
  dryRun: z.boolean().default(false),
  outputFile: z.string().optional(),
  skipDuplicates: z.boolean().default(true),
  overwriteExisting: z.boolean().default(false),
});

export type ImportConfig = z.infer<typeof ImportConfigSchema>;
