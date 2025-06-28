import { createClient } from '@supabase/supabase-js'
import { tools } from '../data/tools'
import type { Tool } from '../lib/types'
import { config } from 'dotenv'
import { join } from 'path'

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') })

// You'll need to add these to your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for admin operations

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required in .env.local')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Types for your improved database schema
interface DbTool {
  id?: string
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

interface AttributeType {
  id: string
  name: string
}

interface AttributeValue {
  id: string
  attribute_type_id: string
  value: string
}

interface OpennessAssessment {
  id?: string
  tool_id: string
  assessment_date: string
  score: number
  level: string
}

interface AssessmentDimension {
  assessment_id: string
  dimension_name: string
  score: string
  note: string
}

export class SupabaseMigration {
  private attributeTypeCache: Map<string, string> = new Map()
  private attributeValueCache: Map<string, string> = new Map()

  async migrate() {
    console.log('🚀 Starting migration to Supabase...')
    
    try {
      // Step 1: Set up attribute types and values
      await this.setupAttributeTypes()
      
      // Step 2: Migrate tools
      await this.migrateTools()
      
      console.log('✅ Migration completed successfully!')
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    }
  }

  private async setupAttributeTypes() {
    console.log('📋 Setting up attribute types and values...')
    
    // Define attribute types we need (reduced since some are now direct columns)
    const attributeTypes = [
      'Category',
      'Organization', 
      'License',
      'Features',
      'Status',
      'Audience',
      'Data Type',
      'Functionality'
    ]

    // Insert attribute types (ignore if they already exist)
    for (const typeName of attributeTypes) {
      const { data, error } = await supabase
        .from('attribute_types')
        .upsert({ name: typeName }, { onConflict: 'name' })
        .select()
        .single()

      if (error && error.code !== '23505') { // 23505 is unique violation
        throw error
      }
      
      if (data) {
        this.attributeTypeCache.set(typeName, data.id)
      } else {
        // If upsert didn't return data, fetch it
        const { data: existingData } = await supabase
          .from('attribute_types')
          .select('id')
          .eq('name', typeName)
          .single()
        
        if (existingData) {
          this.attributeTypeCache.set(typeName, existingData.id)
        }
      }
    }

    // Extract all unique values from our tools
    const allValues = this.extractAttributeValues()
    
    // Insert attribute values
    for (const [typeName, values] of allValues.entries()) {
      const typeId = this.attributeTypeCache.get(typeName)
      if (!typeId) continue

      for (const value of values) {
        const { data, error } = await supabase
          .from('attribute_values')
          .upsert({ 
            attribute_type_id: typeId, 
            value: value 
          }, { onConflict: 'attribute_type_id,value' })
          .select()
          .single()

        if (error && error.code !== '23505') {
          throw error
        }

        if (data) {
          this.attributeValueCache.set(`${typeName}:${value}`, data.id)
        } else {
          // Fetch existing value
          const { data: existingData } = await supabase
            .from('attribute_values')
            .select('id')
            .eq('attribute_type_id', typeId)
            .eq('value', value)
            .single()
          
          if (existingData) {
            this.attributeValueCache.set(`${typeName}:${value}`, existingData.id)
          }
        }
      }
    }

    console.log(`✅ Set up ${this.attributeTypeCache.size} attribute types and ${this.attributeValueCache.size} attribute values`)
  }

  private extractAttributeValues(): Map<string, Set<string>> {
    const values = new Map<string, Set<string>>()
    
    // Initialize sets (icon and embed_supported now in direct columns)
    const attributeTypes = ['Category', 'Organization', 'License', 'Status']
    attributeTypes.forEach(type => values.set(type, new Set()))
    values.set('Features', new Set())

    // Extract values from tools
    tools.forEach(tool => {
      values.get('Category')?.add(tool.category)
      values.get('Organization')?.add(tool.organization)
      values.get('License')?.add(tool.license)
      values.get('Status')?.add(tool.status)
      
      // Add features
      tool.features.forEach(feature => {
        values.get('Features')?.add(feature)
      })
    })

    return values
  }

  private async migrateTools() {
    console.log(`🔄 Migrating ${tools.length} tools...`)
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i]
      console.log(`   ${i + 1}/${tools.length}: ${tool.name}`)
      
      try {
        // Insert tool with improved schema
        const dbTool: DbTool = {
          name: tool.name,
          url: tool.url,
          notes: `Migrated from static data: ${tool.embedNote || ''}`, // Keep original notes field
          description: tool.description, // Use dedicated description field
          embed_url: tool.embedUrl,
          embed_supported: tool.embedSupported,
          icon: tool.icon,
          embed_code: tool.embedUrl !== tool.url ? `<iframe src="${tool.embedUrl}" width="100%" height="500" frameborder="0"></iframe>` : undefined,
          data_link: tool.url,
          submitted_by: 'Migration Script'
        }

        const { data: insertedTool, error: toolError } = await supabase
          .from('tools')
          .insert(dbTool)
          .select()
          .single()

        if (toolError) {
          throw toolError
        }

        // Link tool attributes
        await this.linkToolAttributes(insertedTool.id, tool)
        
        // Insert openness assessment
        await this.insertOpennessAssessment(insertedTool.id, tool)
        
      } catch (error) {
        console.error(`❌ Failed to migrate tool "${tool.name}":`, error)
        // Continue with other tools
      }
    }
  }

  private async linkToolAttributes(toolId: string, tool: Tool) {
    const attributeLinks = []

    // Link simple attributes (icon and embed_supported now direct columns)
    const simpleAttributes = [
      { type: 'Category', value: tool.category },
      { type: 'Organization', value: tool.organization },
      { type: 'License', value: tool.license },
      { type: 'Status', value: tool.status }
    ]

    for (const attr of simpleAttributes) {
      const valueId = this.attributeValueCache.get(`${attr.type}:${attr.value}`)
      if (valueId) {
        attributeLinks.push({
          tool_id: toolId,
          attribute_value_id: valueId
        })
      }
    }

    // Link features (multiple values)
    for (const feature of tool.features) {
      const valueId = this.attributeValueCache.get(`Features:${feature}`)
      if (valueId) {
        attributeLinks.push({
          tool_id: toolId,
          attribute_value_id: valueId
        })
      }
    }

    // Insert all attribute links
    if (attributeLinks.length > 0) {
      const { error } = await supabase
        .from('tool_attribute_links')
        .insert(attributeLinks)

      if (error) {
        throw error
      }
    }
  }

  private async insertOpennessAssessment(toolId: string, tool: Tool) {
    // Insert main assessment
    const assessment: OpennessAssessment = {
      tool_id: toolId,
      assessment_date: new Date().toISOString(),
      score: tool.openness.score,
      level: tool.openness.level
    }

    const { data: insertedAssessment, error: assessmentError } = await supabase
      .from('openness_assessments')
      .insert(assessment)
      .select()
      .single()

    if (assessmentError) {
      throw assessmentError
    }

    // Insert assessment dimensions
    const dimensions: AssessmentDimension[] = Object.entries(tool.openness.dimensions)
      .map(([dimensionName, dimension]) => ({
        assessment_id: insertedAssessment.id,
        dimension_name: dimensionName,
        score: dimension.score,
        note: dimension.note
      }))

    const { error: dimensionsError } = await supabase
      .from('assessment_dimensions')
      .insert(dimensions)

    if (dimensionsError) {
      throw dimensionsError
    }
  }

  // Utility method to clean up if needed
  async cleanupMigration() {
    console.log('🧹 Cleaning up migration data...')
    
    // Delete in reverse order of dependencies
    await supabase.from('assessment_dimensions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('openness_assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('tool_attribute_links').delete().neq('tool_id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('tools').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('✅ Cleanup completed')
  }

  // Verify migration
  async verifyMigration() {
    console.log('🔍 Verifying migration...')
    
    const { data: toolsCount } = await supabase
      .from('tools')
      .select('id', { count: 'exact', head: true })
    
    const { data: assessmentsCount } = await supabase
      .from('openness_assessments')
      .select('id', { count: 'exact', head: true })
    
    const { data: dimensionsCount } = await supabase
      .from('assessment_dimensions')
      .select('id', { count: 'exact', head: true })

    console.log(`📊 Migration Results:`)
    console.log(`   Tools: ${toolsCount?.length || 0}/${tools.length}`)
    console.log(`   Assessments: ${assessmentsCount?.length || 0}/${tools.length}`)
    console.log(`   Dimensions: ${dimensionsCount?.length || 0}/${tools.length * 6}`)
    
    // Sample a few tools to verify data integrity
    const { data: sampleTools } = await supabase
      .from('tools')
      .select(`
        *,
        tool_attribute_links (
          attribute_values (
            value,
            attribute_types (name)
          )
        ),
        openness_assessments (
          *,
          assessment_dimensions (*)
        )
      `)
      .limit(3)

    console.log('📋 Sample migrated tools:')
    sampleTools?.forEach(tool => {
      console.log(`   ${tool.name} - ${tool.tool_attribute_links.length} attributes, ${tool.openness_assessments[0]?.assessment_dimensions.length || 0} dimensions`)
    })
  }
}

// Export migration function
export async function runMigration() {
  const migration = new SupabaseMigration()
  await migration.migrate()
  await migration.verifyMigration()
}

// Export cleanup function
export async function cleanupMigration() {
  const migration = new SupabaseMigration()
  await migration.cleanupMigration()
}
