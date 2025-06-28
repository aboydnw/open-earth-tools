import { createClient } from '@supabase/supabase-js'
import type { Tool } from './types'

// Get database environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types matching your improved Supabase schema
export interface DbTool {
  id: string
  created_at: string
  name: string
  url: string
  notes: string
  description: string
  embed_url: string
  embed_supported: boolean
  icon: string
  embed_code?: string
  data_link?: string
  submitted_by?: string
}

export interface DbAttributeType {
  id: string
  created_at: string
  name: string
}

export interface DbAttributeValue {
  id: string
  created_at: string
  attribute_type_id: string
  value: string
  attribute_types?: DbAttributeType
}

export interface DbToolAttributeLink {
  tool_id: string
  attribute_value_id: string
  created_at: string
  attribute_values?: DbAttributeValue
}

export interface DbOpennessAssessment {
  id: string
  tool_id: string
  assessment_date: string
  score: number
  level: string
  assessment_dimensions?: DbAssessmentDimension[]
}

export interface DbAssessmentDimension {
  id: string
  assessment_id: string
  dimension_name: string
  score: string
  note: string
}

export interface DbToolWithRelations extends DbTool {
  tool_attribute_links?: {
    attribute_values?: {
      value: string
      attribute_types?: {
        name: string
      }
    }
  }[]
  openness_assessments?: {
    score: number
    level: string
    assessment_date: string
    assessment_dimensions?: {
      dimension_name: string
      score: string
      note: string
    }[]
  }[]
}

// Service class for database operations
export class ToolsDatabase {
  
  // Get all tools with their attributes and assessments
  async getTools(filters?: { category?: string }): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        tool_attribute_links (
          attribute_values (
            value,
            attribute_types (
              name
            )
          )
        ),
        openness_assessments (
          score,
          level,
          assessment_date,
          assessment_dimensions (
            dimension_name,
            score,
            note
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Database query failed:', error);
      throw new Error(`Failed to fetch tools: ${error.message}`)
    }

    const transformedTools = data?.map((dbTool) => this.transformDbToolToTool(dbTool)) || [];
    
    return transformedTools;
  }

  // Get a single tool by ID
  async getTool(id: string): Promise<Tool | null> {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        tool_attribute_links (
          attribute_values (
            value,
            attribute_types (
              name
            )
          )
        ),
        openness_assessments (
          score,
          level,
          assessment_date,
          assessment_dimensions (
            dimension_name,
            score,
            note
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null
      }
      throw new Error(`Failed to fetch tool: ${error.message}`)
    }

    return this.transformDbToolToTool(data)
  }

  // Get tools filtered by category
  async getToolsByCategory(category: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        tool_attribute_links!inner (
          attribute_values!inner (
            value,
            attribute_types!inner (
              name
            )
          )
        ),
        openness_assessments (
          score,
          level,
          assessment_date,
          assessment_dimensions (
            dimension_name,
            score,
            note
          )
        )
      `)
      .eq('tool_attribute_links.attribute_values.attribute_types.name', 'Category')
      .eq('tool_attribute_links.attribute_values.value', category)

    if (error) {
      throw new Error(`Failed to fetch tools by category: ${error.message}`)
    }

    return data?.map((dbTool) => this.transformDbToolToTool(dbTool)) || []
  }

  // Get unique categories
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('attribute_values')
      .select(`
        value,
        attribute_types!inner (
          name
        )
      `)
      .eq('attribute_types.name', 'Category')
      .order('value')

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    return data?.map(item => item.value) || []
  }

  // Get unique organizations
  async getOrganizations(): Promise<string[]> {
    const { data, error } = await supabase
      .from('attribute_values')
      .select(`
        value,
        attribute_types!inner (
          name
        )
      `)
      .eq('attribute_types.name', 'Organization')
      .order('value')

    if (error) {
      throw new Error(`Failed to fetch organizations: ${error.message}`)
    }

    return data?.map(item => item.value) || []
  }

  // Validate openness level string
  private validateOpennessLevel(level: string | undefined): "Fully Open" | "Mostly Open" | "Partially Open" | "Minimally Open" {
    const validLevels = ["Fully Open", "Mostly Open", "Partially Open", "Minimally Open"] as const
    if (level && validLevels.includes(level as any)) {
      return level as "Fully Open" | "Mostly Open" | "Partially Open" | "Minimally Open"
    }
    return "Minimally Open" // Default fallback
  }

  // Validate dimension score string
  private validateDimensionScore(score: string | undefined): "green" | "yellow" | "red" {
    const validScores = ["green", "yellow", "red"] as const
    if (score && validScores.includes(score as any)) {
      return score as "green" | "yellow" | "red"
    }
    return "red" // Default fallback (most restrictive)
  }

  // Transform database tool to our Tool interface
  private transformDbToolToTool(dbTool: DbToolWithRelations): Tool {
    // Group attributes by type
    const attributes = new Map<string, string[]>()
    
    dbTool.tool_attribute_links?.forEach((link) => {
      const typeName = link.attribute_values?.attribute_types?.name
      const value = link.attribute_values?.value
      
      if (typeName && value) {
        if (!attributes.has(typeName)) {
          attributes.set(typeName, [])
        }
        attributes.get(typeName)!.push(value)
      }
    })

    // Get the latest openness assessment
    const latestAssessment = dbTool.openness_assessments?.[0]
    
    // Transform assessment dimensions to our format
    const defaultDimensions: {
      "Software Licensing": { score: "green" | "yellow" | "red"; note: string };
      "Data Licensing": { score: "green" | "yellow" | "red"; note: string };
      "Technical Accessibility": { score: "green" | "yellow" | "red"; note: string };
      "Data Standards": { score: "green" | "yellow" | "red"; note: string };
      "Infrastructure": { score: "green" | "yellow" | "red"; note: string };
      "Community Governance": { score: "green" | "yellow" | "red"; note: string };
    } = {
      "Software Licensing": { score: "red", note: "No assessment available" },
      "Data Licensing": { score: "red", note: "No assessment available" },
      "Technical Accessibility": { score: "red", note: "No assessment available" },
      "Data Standards": { score: "red", note: "No assessment available" },
      "Infrastructure": { score: "red", note: "No assessment available" },
      "Community Governance": { score: "red", note: "No assessment available" }
    }
    
    const dimensions = { ...defaultDimensions }
    if (latestAssessment?.assessment_dimensions) {
      latestAssessment.assessment_dimensions.forEach((dim) => {
        const dimensionName = dim.dimension_name as keyof typeof dimensions
        if (dimensionName in dimensions) {
          dimensions[dimensionName] = {
            score: this.validateDimensionScore(dim.score),
            note: dim.note || ''
          }
        }
      })
    }

    // Generate ID from name if needed (for compatibility)
    const id = this.generateIdFromName(dbTool.name)

    const tool: Tool = {
      id,
      name: dbTool.name,
      organization: attributes.get('Organization')?.[0] || 'Unknown',
      description: dbTool.description || dbTool.notes || '', // Use dedicated description field
      url: dbTool.url,
      embedUrl: dbTool.embed_url || dbTool.url, // Use dedicated embed_url field
      license: attributes.get('License')?.[0] || 'Unknown',
      category: attributes.get('Category')?.[0] || 'Other',
      features: attributes.get('Features') || [],
      icon: dbTool.icon || '🌍', // Use direct icon field
      status: attributes.get('Status')?.[0] || 'Production',
      embedSupported: dbTool.embed_supported, // Use direct boolean field
      embedNote: dbTool.embed_code ? 'Embed code available' : (dbTool.embed_supported ? 'Embedding supported' : 'Embedding not supported'),
      openness: {
        score: latestAssessment?.score || 0,
        level: this.validateOpennessLevel(latestAssessment?.level),
        dimensions: dimensions
      }
    }
    
    return tool;
  }

  private generateIdFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Create a new tool (for form submissions)
  async createTool(toolData: Partial<Tool>): Promise<Tool> {
    // This will be used when we implement the submission form
    // For now, just throw an error
    throw new Error('Tool creation not yet implemented')
  }

  // Get statistics
  async getStats() {
    const [toolsCount, categoriesCount, organizationsCount] = await Promise.all([
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      this.getCategories().then(cats => cats.length),
      this.getOrganizations().then(orgs => orgs.length)
    ])

    return {
      totalTools: toolsCount.count || 0,
      totalCategories: categoriesCount,
      totalOrganizations: organizationsCount
    }
  }
}

// Export singleton instance
export const toolsDb = new ToolsDatabase()
