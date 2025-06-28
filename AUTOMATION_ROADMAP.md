# Tool Addition Automation Improvements

## Current Pain Points

The manual process of adding 24 tools took excessive time due to:

1. **Manual Tool Entry** - Each tool required individual TypeScript object creation
2. **Manual Openness Assessment** - Scoring 6 dimensions per tool manually
3. **Manual Category Mapping** - Determining categories from data types
4. **Manual Icon Selection** - Choosing appropriate emojis
5. **Manual Embedding Analysis** - Determining iframe support per platform
6. **Copy-Paste Errors** - Risk of formatting mistakes in large TypeScript arrays

## Proposed Code Improvements

### 1. Create Tool Import Script (`scripts/import-tools.ts`)

```typescript
interface RawToolData {
  name: string;
  url: string;
  audience: string[];
  data_type: string[];
  functionality: string[];
  notes: string;
  standout_features?: string[];
  suggested_improvements?: string[];
}

interface ImportConfig {
  categoryMapping: Record<string, string>;
  iconMapping: Record<string, string>;
  organizationMapping: Record<string, string>;
  licenseMapping: Record<string, string>;
  embeddingRules: Record<string, boolean>;
}

class ToolImporter {
  constructor(private config: ImportConfig) {}
  
  async importFromJSON(jsonData: RawToolData[]): Promise<Tool[]> {
    return jsonData.map(raw => this.convertToTool(raw));
  }
  
  private convertToTool(raw: RawToolData): Tool {
    // Auto-generate ID, category, icon, etc.
  }
  
  private assessOpenness(tool: RawToolData): OpennessAssessment {
    // Automated openness scoring based on rules
  }
}
```

### 2. Configuration-Driven Approach (`config/tool-mappings.ts`)

```typescript
export const CATEGORY_MAPPING = {
  "Environmental Justice": "Environmental Justice",
  "Air Quality": "Environmental Monitoring",
  "Climate": "Climate",
  "Emissions": "Emissions",
  // ... comprehensive mapping
};

export const ICON_MAPPING = {
  "Environmental Justice": "⚖️",
  "Environmental Monitoring": "🌡️",
  "Climate": "🌡️",
  "Carbon": "🌿",
  // ... comprehensive mapping
};

export const ORGANIZATION_PATTERNS = [
  { pattern: /nasa\.gov|earthdata\.nasa\.gov|earth\.gov/, org: "NASA" },
  { pattern: /carbonplan\.org/, org: "CarbonPlan" },
  { pattern: /theplotline\.org/, org: "The Plotline" },
  // ... pattern-based org detection
];

export const EMBEDDING_RULES = [
  { pattern: /nasa\.gov|earth\.gov/, canEmbed: false, reason: "Government domain restrictions" },
  { pattern: /carbonplan\.org/, canEmbed: true, reason: "Open source tool supports embedding" },
  // ... rule-based embedding detection
];
```

### 3. Automated Openness Assessment (`utils/openness-assessor.ts`)

```typescript
interface AssessmentRules {
  softwareLicensing: Array<{
    condition: (tool: RawToolData) => boolean;
    score: "green" | "yellow" | "red";
    note: string;
  }>;
  dataLicensing: Array<{
    condition: (tool: RawToolData) => boolean;
    score: "green" | "yellow" | "red";
    note: string;
  }>;
  // ... other dimensions
}

export class OpennessAssessor {
  private rules: AssessmentRules;
  
  assess(tool: RawToolData): OpennessAssessment {
    // Rule-based scoring system
    const dimensions = {
      "Software Licensing": this.assessDimension(tool, this.rules.softwareLicensing),
      "Data Licensing": this.assessDimension(tool, this.rules.dataLicensing),
      // ... other dimensions
    };
    
    return {
      score: this.calculateOverallScore(dimensions),
      level: this.determineLevel(score),
      dimensions
    };
  }
}
```

### 4. CLI Tool for Import (`scripts/cli.ts`)

```bash
# Usage examples:
npm run import-tools -- --file tools.json
npm run import-tools -- --file tools.json --validate-only
npm run import-tools -- --file tools.json --output preview.ts
npm run update-mappings -- --category "New Category" --icon "🆕"
```

### 5. Validation System (`utils/validator.ts`)

```typescript
export class ToolValidator {
  validateTool(tool: Tool): ValidationResult {
    const errors: string[] = [];
    
    // Check required fields
    if (!tool.name) errors.push("Name is required");
    if (!tool.url) errors.push("URL is required");
    
    // Validate URL format
    if (!this.isValidURL(tool.url)) errors.push("Invalid URL format");
    
    // Check for duplicates
    if (this.isDuplicate(tool)) errors.push("Duplicate tool detected");
    
    // Validate openness scores
    if (!this.isValidOpennessScore(tool.openness)) {
      errors.push("Invalid openness assessment");
    }
    
    return { isValid: errors.length === 0, errors };
  }
}
```

### 6. Data Schema Validation (`schemas/tool.schema.ts`)

```typescript
import { z } from 'zod';

export const RawToolSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  audience: z.array(z.string()),
  data_type: z.array(z.string()),
  functionality: z.array(z.string()),
  notes: z.string(),
  standout_features: z.array(z.string()).optional(),
  suggested_improvements: z.array(z.string()).optional(),
});

export const ToolSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  organization: z.string(),
  description: z.string(),
  url: z.string().url(),
  embedUrl: z.string().url(),
  license: z.string(),
  category: z.string(),
  features: z.array(z.string()),
  icon: z.string(),
  status: z.literal("Production"),
  embedSupported: z.boolean(),
  embedNote: z.string(),
  openness: OpennessAssessmentSchema,
});
```

### 7. Interactive Tool Builder (`scripts/interactive-builder.ts`)

```typescript
// Interactive CLI for building tools
export class InteractiveToolBuilder {
  async buildTool(): Promise<Tool> {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Tool name:' },
      { type: 'input', name: 'url', message: 'Tool URL:' },
      { type: 'checkbox', name: 'dataTypes', message: 'Data types:', choices: DATA_TYPE_OPTIONS },
      { type: 'list', name: 'organization', message: 'Organization:', choices: ORGANIZATION_OPTIONS },
      // ... guided prompts
    ]);
    
    return this.convertAnswersToTool(answers);
  }
}
```

## Implementation Plan

### Phase 1: Core Infrastructure
1. Create `scripts/` directory
2. Implement `ToolImporter` class
3. Create configuration files
4. Add validation system

### Phase 2: Automation Rules
1. Build comprehensive mapping configurations
2. Implement rule-based openness assessment
3. Create embedding detection rules
4. Add duplicate detection

### Phase 3: CLI Tools
1. Create import CLI command
2. Add validation CLI command
3. Implement interactive builder
4. Add mapping update utilities

### Phase 4: Quality Assurance
1. Add comprehensive tests
2. Create documentation
3. Add error handling
4. Implement dry-run mode

## Expected Benefits

### Time Savings
- **Current**: ~2-3 hours for 24 tools manually
- **With automation**: ~10-15 minutes for 24 tools

### Quality Improvements
- Consistent formatting
- Reduced human error
- Standardized assessments
- Automated validation

### Maintainability
- Easy to update rules
- Version-controlled mappings
- Reproducible imports
- Clear audit trail

## Usage Example

```bash
# Import tools from JSON
npm run import-tools -- --file new-tools.json

# Validate before importing
npm run import-tools -- --file new-tools.json --validate-only

# Preview generated TypeScript
npm run import-tools -- --file new-tools.json --dry-run

# Update existing tools
npm run update-tools -- --id "tool-id" --category "New Category"

# Interactive tool creation
npm run create-tool
```

This automation would reduce a 2-3 hour manual process to a 10-15 minute automated workflow while improving consistency and reducing errors.
