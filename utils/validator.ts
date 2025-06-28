import { Tool, ValidationResult, ToolSchema } from '../schemas/tool.schema';
import { tools } from '../data/tools';

export class ToolValidator {
  private existingTools: Tool[] = tools as Tool[];

  validateTool(tool: Tool): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Use Zod schema validation
      ToolSchema.parse(tool);
    } catch (error: any) {
      if (error.errors) {
        errors.push(...error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`));
      } else {
        errors.push(`Schema validation failed: ${error.message}`);
      }
    }

    // Additional custom validations
    
    // Check for duplicate IDs
    if (this.isDuplicateId(tool.id)) {
      errors.push(`Duplicate tool ID: ${tool.id}`);
    }

    // Check for duplicate URLs
    const duplicateUrl = this.findDuplicateUrl(tool.url);
    if (duplicateUrl) {
      warnings.push(`Similar URL already exists for tool: ${duplicateUrl.name}`);
    }

    // Validate URL accessibility (basic check)
    if (!this.isValidUrlFormat(tool.url)) {
      errors.push(`Invalid URL format: ${tool.url}`);
    }

    // Check embed URL consistency
    if (tool.embedSupported && !tool.embedUrl) {
      errors.push("Embed URL is required when embedSupported is true");
    }

    // Validate openness scores
    const opennessValidation = this.validateOpennessAssessment(tool);
    if (!opennessValidation.isValid) {
      errors.push(...opennessValidation.errors);
    }

    // Check for reasonable description length
    if (tool.description.length < 20) {
      warnings.push("Description seems too short for a comprehensive tool description");
    }

    // Check for reasonable number of features
    if (tool.features.length === 0) {
      errors.push("At least one feature is required");
    } else if (tool.features.length > 10) {
      warnings.push("Large number of features - consider consolidating");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  validateMultipleTools(tools: Tool[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    tools.forEach((tool, index) => {
      const result = this.validateTool(tool);
      if (!result.isValid) {
        allErrors.push(`Tool ${index + 1} (${tool.name || 'unnamed'}): ${result.errors.join(', ')}`);
      }
      if (result.warnings) {
        allWarnings.push(`Tool ${index + 1} (${tool.name || 'unnamed'}): ${result.warnings.join(', ')}`);
      }
    });

    // Check for duplicate IDs across the batch
    const ids = tools.map(t => t.id).filter(Boolean);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      allErrors.push(`Duplicate IDs in batch: ${duplicateIds.join(', ')}`);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  }

  private isDuplicateId(id: string): boolean {
    return this.existingTools.some(tool => tool.id === id);
  }

  private findDuplicateUrl(url: string): Tool | undefined {
    return this.existingTools.find(tool => 
      tool.url === url || 
      this.normalizeUrl(tool.url) === this.normalizeUrl(url)
    );
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove trailing slashes, www, and common parameters
      return urlObj.hostname.replace(/^www\./, '') + urlObj.pathname.replace(/\/$/, '');
    } catch {
      return url;
    }
  }

  private isValidUrlFormat(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  private validateOpennessAssessment(tool: Tool): ValidationResult {
    const errors: string[] = [];
    
    // Check that openness score matches dimensions
    const dimensionScores = Object.values(tool.openness.dimensions);
    let calculatedScore = 0;
    
    dimensionScores.forEach(dimension => {
      switch (dimension.score) {
        case "green":
          calculatedScore += 1;
          break;
        case "yellow":
          calculatedScore += 0.5;
          break;
        case "red":
          calculatedScore += 0;
          break;
      }
    });

    calculatedScore = Math.round(calculatedScore);
    
    if (calculatedScore !== tool.openness.score) {
      errors.push(`Openness score mismatch: calculated ${calculatedScore}, but tool has ${tool.openness.score}`);
    }

    // Validate openness level matches score
    const expectedLevel = this.getExpectedOpennessLevel(tool.openness.score);
    if (expectedLevel !== tool.openness.level) {
      errors.push(`Openness level mismatch: expected "${expectedLevel}" for score ${tool.openness.score}, but got "${tool.openness.level}"`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private getExpectedOpennessLevel(score: number): string {
    if (score >= 6) return "Fully Open";
    if (score >= 4) return "Mostly Open";
    if (score >= 2) return "Partially Open";
    return "Minimally Open";
  }

  // Update existing tools list (useful for batch validation)
  updateExistingTools(newTools: Tool[]): void {
    this.existingTools = [...this.existingTools, ...newTools];
  }
}
