import { createClient } from '@supabase/supabase-js'
import type { Tool, OpennessAssessment } from './types'

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

    // Use the actual database ID
    const id = dbTool.id

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

  // Create a new tool
  async createTool(toolData: Omit<Tool, 'id'>): Promise<Tool> {
    // Let Supabase generate the UUID for the database
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .insert({
        name: toolData.name,
        url: toolData.url,
        description: toolData.description,
        embed_url: toolData.embedUrl,
        embed_supported: toolData.embedSupported,
        icon: toolData.icon,
        notes: toolData.embedNote || ''
      })
      .select()
      .single();

    if (toolError) {
      throw new Error(`Failed to create tool: ${toolError.message}`);
    }

    const toolId = tool.id; // Use the UUID generated by Supabase

    // Create attribute values and links
    await this.createToolAttributes(toolId, toolData);
    
    // Create openness assessment
    await this.createOpennessAssessment(toolId, toolData.openness);
    
    // Return the created tool
    const createdTool = await this.getTool(toolId);
    if (!createdTool) {
      throw new Error('Failed to retrieve created tool');
    }
    
    return createdTool;
  }

  // Update an existing tool
  async updateTool(id: string, toolData: Partial<Tool>): Promise<Tool> {
    // Update the main tool record
    const updateData: Partial<DbTool> = {};
    if (toolData.name) updateData.name = toolData.name;
    if (toolData.url) updateData.url = toolData.url;
    if (toolData.description) updateData.description = toolData.description;
    if (toolData.embedUrl) updateData.embed_url = toolData.embedUrl;
    if (toolData.embedSupported !== undefined) updateData.embed_supported = toolData.embedSupported;
    if (toolData.icon) updateData.icon = toolData.icon;
    if (toolData.embedNote) updateData.notes = toolData.embedNote;
    
    const { error: toolError } = await supabase
      .from('tools')
      .update(updateData)
      .eq('id', id);

    if (toolError) {
      throw new Error(`Failed to update tool: ${toolError.message}`);
    }

    // Update attributes if provided
    if (toolData.organization || toolData.license || toolData.category || toolData.features || toolData.status) {
      await this.updateToolAttributes(id, toolData);
    }
    
    // Update openness assessment if provided
    if (toolData.openness) {
      await this.updateOpennessAssessment(id, toolData.openness);
    }
    
    // Return the updated tool
    const updatedTool = await this.getTool(id);
    if (!updatedTool) {
      throw new Error('Failed to retrieve updated tool');
    }
    
    return updatedTool;
  }

  // Delete a tool and all related records
  async deleteTool(id: string): Promise<void> {
    // Delete in order due to foreign key constraints
    
    // 1. Delete assessment dimensions
    const { data: assessments } = await supabase
      .from('openness_assessments')
      .select('id')
      .eq('tool_id', id);
    
    if (assessments && assessments.length > 0) {
      const assessmentIds = assessments.map(a => a.id);
      await supabase
        .from('assessment_dimensions')
        .delete()
        .in('assessment_id', assessmentIds);
    }
    
    // 2. Delete openness assessments
    await supabase
      .from('openness_assessments')
      .delete()
      .eq('tool_id', id);
    
    // 3. Delete tool attribute links
    await supabase
      .from('tool_attribute_links')
      .delete()
      .eq('tool_id', id);
    
    // 4. Delete the tool itself
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete tool: ${error.message}`);
    }
  }

  // Helper method to create tool attributes
  private async createToolAttributes(toolId: string, toolData: Omit<Tool, 'id'>): Promise<void> {
    const attributesToCreate = [
      { type: 'Organization', value: toolData.organization },
      { type: 'License', value: toolData.license },
      { type: 'Category', value: toolData.category },
      { type: 'Status', value: toolData.status },
      ...toolData.features.map(feature => ({ type: 'Features', value: feature }))
    ];

    for (const attr of attributesToCreate) {
      await this.createOrLinkAttribute(toolId, attr.type, attr.value);
    }
  }

  // Helper method to update tool attributes
  private async updateToolAttributes(toolId: string, toolData: Partial<Tool>): Promise<void> {
    // Remove existing attributes that we're updating
    const typesToUpdate = [];
    if (toolData.organization) typesToUpdate.push('Organization');
    if (toolData.license) typesToUpdate.push('License');
    if (toolData.category) typesToUpdate.push('Category');
    if (toolData.status) typesToUpdate.push('Status');
    if (toolData.features) typesToUpdate.push('Features');

    if (typesToUpdate.length > 0) {
      // Delete existing links for these types by finding the attribute value IDs first
      for (const typeName of typesToUpdate) {
        // Get attribute type ID
        const { data: attributeType } = await supabase
          .from('attribute_types')
          .select('id')
          .eq('name', typeName)
          .single();
        
        if (attributeType) {
          // Get attribute value IDs for this type
          const { data: attributeValues } = await supabase
            .from('attribute_values')
            .select('id')
            .eq('attribute_type_id', attributeType.id);
          
          if (attributeValues && attributeValues.length > 0) {
            const valueIds = attributeValues.map(v => v.id);
            // Delete links for this tool and these attribute values
            await supabase
              .from('tool_attribute_links')
              .delete()
              .eq('tool_id', toolId)
              .in('attribute_value_id', valueIds);
          }
        }
      }
    }

    // Create new attributes
    const attributesToCreate = [];
    if (toolData.organization) attributesToCreate.push({ type: 'Organization', value: toolData.organization });
    if (toolData.license) attributesToCreate.push({ type: 'License', value: toolData.license });
    if (toolData.category) attributesToCreate.push({ type: 'Category', value: toolData.category });
    if (toolData.status) attributesToCreate.push({ type: 'Status', value: toolData.status });
    if (toolData.features) {
      attributesToCreate.push(...toolData.features.map(feature => ({ type: 'Features', value: feature })));
    }

    for (const attr of attributesToCreate) {
      await this.createOrLinkAttribute(toolId, attr.type, attr.value);
    }
  }

  // Helper method to create or link an attribute
  private async createOrLinkAttribute(toolId: string, typeName: string, value: string): Promise<void> {
    // Get or create attribute type
    let { data: attributeType } = await supabase
      .from('attribute_types')
      .select('id')
      .eq('name', typeName)
      .single();

    if (!attributeType) {
      const { data: newType, error: typeError } = await supabase
        .from('attribute_types')
        .insert({ name: typeName })
        .select('id')
        .single();
      
      if (typeError) throw new Error(`Failed to create attribute type: ${typeError.message}`);
      attributeType = newType;
    }

    // Get or create attribute value
    let { data: attributeValue } = await supabase
      .from('attribute_values')
      .select('id')
      .eq('attribute_type_id', attributeType.id)
      .eq('value', value)
      .single();

    if (!attributeValue) {
      const { data: newValue, error: valueError } = await supabase
        .from('attribute_values')
        .insert({ 
          attribute_type_id: attributeType.id, 
          value: value 
        })
        .select('id')
        .single();
      
      if (valueError) throw new Error(`Failed to create attribute value: ${valueError.message}`);
      attributeValue = newValue;
    }

    // Create the link
    const { error: linkError } = await supabase
      .from('tool_attribute_links')
      .insert({
        tool_id: toolId,
        attribute_value_id: attributeValue.id
      });

    if (linkError) {
      throw new Error(`Failed to create attribute link: ${linkError.message}`);
    }
  }

  // Helper method to create openness assessment
  private async createOpennessAssessment(toolId: string, openness: OpennessAssessment): Promise<void> {
    const { data: assessment, error: assessmentError } = await supabase
      .from('openness_assessments')
      .insert({
        tool_id: toolId,
        score: Math.round(openness.score), // Round to nearest integer for database
        level: openness.level,
        assessment_date: new Date().toISOString()
      })
      .select('id')
      .single();

    if (assessmentError) {
      throw new Error(`Failed to create openness assessment: ${assessmentError.message}`);
    }

    // Create assessment dimensions
    const dimensions = Object.entries(openness.dimensions).map(([name, dimension]) => ({
      assessment_id: assessment.id,
      dimension_name: name,
      score: dimension.score,
      note: dimension.note
    }));

    const { error: dimensionsError } = await supabase
      .from('assessment_dimensions')
      .insert(dimensions);

    if (dimensionsError) {
      throw new Error(`Failed to create assessment dimensions: ${dimensionsError.message}`);
    }
  }

  // Helper method to update openness assessment
  private async updateOpennessAssessment(toolId: string, openness: OpennessAssessment): Promise<void> {
    // Delete existing assessment and dimensions
    const { data: existingAssessments } = await supabase
      .from('openness_assessments')
      .select('id')
      .eq('tool_id', toolId);

    if (existingAssessments && existingAssessments.length > 0) {
      const assessmentIds = existingAssessments.map(a => a.id);
      
      // Delete dimensions first
      await supabase
        .from('assessment_dimensions')
        .delete()
        .in('assessment_id', assessmentIds);
      
      // Delete assessments
      await supabase
        .from('openness_assessments')
        .delete()
        .eq('tool_id', toolId);
    }

    // Create new assessment
    await this.createOpennessAssessment(toolId, openness);
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
