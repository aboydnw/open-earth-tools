import { RawToolData, Tool, ImportConfig } from '../schemas/tool.schema';
import { OpennessAssessor } from '../utils/openness-assessor';
import { ToolValidator } from '../utils/validator';
import { 
  CATEGORY_MAPPING, 
  ICON_MAPPING, 
  ORGANIZATION_PATTERNS, 
  LICENSE_MAPPING,
  EMBEDDING_RULES,
  FEATURE_MAPPING 
} from '../config/tool-mappings';

export class ToolImporter {
  private opennessAssessor: OpennessAssessor;
  private validator: ToolValidator;

  constructor() {
    this.opennessAssessor = new OpennessAssessor();
    this.validator = new ToolValidator();
  }

  async importFromJSON(jsonData: RawToolData[], config: ImportConfig = {}): Promise<Tool[]> {
    const tools: Tool[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const rawTool = jsonData[i];
      
      try {
        const convertedTool = this.convertToTool(rawTool);
        
        // Validate the converted tool
        const validation = this.validator.validateTool(convertedTool);
        
        if (validation.isValid) {
          tools.push(convertedTool);
          if (validation.warnings) {
            console.warn(`Tool "${convertedTool.name}" warnings:`, validation.warnings);
          }
        } else {
          errors.push(`Tool ${i + 1} "${rawTool.name}": ${validation.errors.join(', ')}`);
        }
      } catch (error) {
        errors.push(`Tool ${i + 1} "${rawTool.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0 && !config.validateOnly) {
      console.error('Import errors:', errors);
      throw new Error(`Failed to import ${errors.length} tools. Use --validate-only to see all errors.`);
    }

    return tools;
  }

  private convertToTool(raw: RawToolData): Tool {
    const id = this.generateId(raw.name);
    const organization = this.detectOrganization(raw);
    const license = this.detectLicense(raw);
    const category = this.detectCategory(raw);
    const icon = this.getIcon(category);
    const features = this.generateFeatures(raw);
    const embedSupported = this.detectEmbedSupport(raw.url);
    const embedNote = this.generateEmbedNote(raw.url, embedSupported);
    const description = this.generateDescription(raw);
    const openness = this.opennessAssessor.assess(raw);

    return {
      id,
      name: raw.name,
      organization,
      description,
      url: raw.url,
      embedUrl: raw.url, // Default to same as main URL
      license,
      category,
      features,
      icon,
      status: "Production",
      embedSupported,
      embedNote,
      openness,
    };
  }

  private generateId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  private detectOrganization(tool: RawToolData): string {
    // Check if organization is provided
    if (tool.organization) {
      return tool.organization;
    }

    // Try to detect from URL patterns
    for (const pattern of ORGANIZATION_PATTERNS) {
      if (pattern.pattern.test(tool.url)) {
        return pattern.org;
      }
    }

    // Try to extract from URL domain
    try {
      const url = new URL(tool.url);
      const domain = url.hostname.replace(/^www\./, '');
      
      // Convert domain to organization name
      const domainParts = domain.split('.');
      if (domainParts.length >= 2) {
        return domainParts[0]
          .split(/[-_]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
    } catch {
      // Invalid URL, fallback
    }

    return "Unknown Organization";
  }

  private detectLicense(tool: RawToolData): string {
    if (tool.license) {
      return tool.license;
    }

    const searchText = [tool.name, tool.notes, tool.url].join(' ').toLowerCase();
    
    for (const [keyword, license] of Object.entries(LICENSE_MAPPING)) {
      if (searchText.includes(keyword)) {
        return license;
      }
    }

    // Default based on organization
    const org = this.detectOrganization(tool);
    if (org.includes('NASA') || org.includes('USGS') || org.includes('NOAA')) {
      return 'Public Domain';
    }
    
    return 'Unknown';
  }

  private detectCategory(tool: RawToolData): string {
    if (tool.category) {
      return tool.category;
    }

    // Try to detect from data types
    if (tool.data_type && tool.data_type.length > 0) {
      for (const dataType of tool.data_type) {
        const mappedCategory = CATEGORY_MAPPING[dataType];
        if (mappedCategory) {
          return mappedCategory;
        }
      }
    }

    // Try to detect from functionality
    if (tool.functionality && tool.functionality.length > 0) {
      for (const func of tool.functionality) {
        const mappedCategory = CATEGORY_MAPPING[func];
        if (mappedCategory) {
          return mappedCategory;
        }
      }
    }

    // Try to detect from name and notes
    const searchText = [tool.name, tool.notes].join(' ').toLowerCase();
    
    for (const [keyword, category] of Object.entries(CATEGORY_MAPPING)) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }

    return 'Environmental Monitoring'; // Default category
  }

  private getIcon(category: string): string {
    return ICON_MAPPING[category] || '🌍';
  }

  private generateFeatures(tool: RawToolData): string[] {
    const features: string[] = [];

    // Use standout features if provided
    if (tool.standout_features && tool.standout_features.length > 0) {
      features.push(...tool.standout_features);
    }

    // Generate features from functionality
    if (tool.functionality && tool.functionality.length > 0) {
      for (const func of tool.functionality) {
        const mappedFeatures = FEATURE_MAPPING[func.toLowerCase()];
        if (mappedFeatures && mappedFeatures.length > 0) {
          features.push(mappedFeatures[0]); // Take first mapped feature
        } else {
          features.push(func); // Use as-is if no mapping
        }
      }
    }

    // Ensure we have at least some features
    if (features.length === 0) {
      features.push('Data visualization', 'Interactive exploration', 'Web-based access');
    }

    // Limit to 3-5 features and ensure uniqueness
    return [...new Set(features)].slice(0, 5);
  }

  private detectEmbedSupport(url: string): boolean {
    for (const rule of EMBEDDING_RULES) {
      if (rule.pattern.test(url)) {
        return rule.canEmbed;
      }
    }
    
    // Default to true for unknown domains
    return true;
  }

  private generateEmbedNote(url: string, embedSupported: boolean): string {
    for (const rule of EMBEDDING_RULES) {
      if (rule.pattern.test(url)) {
        return rule.reason;
      }
    }
    
    return embedSupported 
      ? "Web-based platform supports embedding"
      : "Embedding support unclear";
  }

  private generateDescription(tool: RawToolData): string {
    if (tool.notes && tool.notes.length > 20) {
      // Clean up the notes to make a good description
      let description = tool.notes.trim();
      
      // Ensure it ends with a period
      if (!description.endsWith('.')) {
        description += '.';
      }
      
      return description;
    }

    // Generate a basic description
    const category = this.detectCategory(tool);
    const organization = this.detectOrganization(tool);
    
    return `${category} tool developed by ${organization} providing web-based access to Earth science data and visualization capabilities.`;
  }

  // Helper method for batch processing with progress tracking
  async importWithProgress(
    jsonData: RawToolData[], 
    config: ImportConfig = {},
    onProgress?: (current: number, total: number, toolName: string) => void
  ): Promise<Tool[]> {
    const tools: Tool[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const rawTool = jsonData[i];
      
      if (onProgress) {
        onProgress(i + 1, jsonData.length, rawTool.name);
      }
      
      try {
        const convertedTool = this.convertToTool(rawTool);
        const validation = this.validator.validateTool(convertedTool);
        
        if (validation.isValid) {
          tools.push(convertedTool);
        } else {
          errors.push(`Tool ${i + 1} "${rawTool.name}": ${validation.errors.join(', ')}`);
        }
      } catch (error) {
        errors.push(`Tool ${i + 1} "${rawTool.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0 && !config.validateOnly) {
      throw new Error(`Failed to import ${errors.length} tools: ${errors.join('; ')}`);
    }

    return tools;
  }
}
