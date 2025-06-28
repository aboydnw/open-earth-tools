import { Tool } from './types'
import { toolsDb } from './database'

// Filters interface for better type safety
export interface ToolFilters {
  category?: string
  opennessLevel?: string
  embedSupported?: boolean
  searchTerm?: string
}

// Statistics interface
export interface DirectoryStats {
  totalTools: number
  embeddableTools: number
  totalCategories: number
  totalOrganizations: number
  openToolsPercentage: number
  fullyOpenTools: number
}

// Repository interface for better abstraction
export interface ToolRepository {
  getTools(filters?: ToolFilters): Promise<Tool[]>
  getTool(id: string): Promise<Tool | null>
  getCategories(): Promise<string[]>
  getOrganizations(): Promise<string[]>
  getStats(): Promise<DirectoryStats>
  searchTools(searchTerm: string): Promise<Tool[]>
}

// Implementation of the repository
export class SupabaseToolRepository implements ToolRepository {
  async getTools(filters?: ToolFilters): Promise<Tool[]> {
    // For now, get all tools and filter client-side
    // TODO: Implement server-side filtering for better performance
    const allTools = await toolsDb.getTools()
    
    if (!filters) {
      return allTools
    }
    
    return allTools.filter(tool => {
      // Category filter
      if (filters.category && filters.category !== 'All' && tool.category !== filters.category) {
        return false
      }
      
      // Openness level filter
      if (filters.opennessLevel && filters.opennessLevel !== 'All' && tool.openness.level !== filters.opennessLevel) {
        return false
      }
      
      // Embed support filter
      if (filters.embedSupported !== undefined && tool.embedSupported !== filters.embedSupported) {
        return false
      }
      
      // Search term filter (name, description, organization)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesSearch = 
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.organization.toLowerCase().includes(searchLower) ||
          tool.features.some(feature => feature.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) {
          return false
        }
      }
      
      return true
    })
  }
  
  async getTool(id: string): Promise<Tool | null> {
    return await toolsDb.getTool(id)
  }
  
  async getCategories(): Promise<string[]> {
    return await toolsDb.getCategories()
  }
  
  async getOrganizations(): Promise<string[]> {
    return await toolsDb.getOrganizations()
  }
  
  async getStats(): Promise<DirectoryStats> {
    const tools = await toolsDb.getTools()
    const embeddableTools = tools.filter(tool => tool.embedSupported).length
    const uniqueCategories = new Set(tools.map(tool => tool.category)).size
    const uniqueOrganizations = new Set(tools.map(tool => tool.organization)).size
    
    const openTools = tools.filter(tool => 
      tool.openness.level === 'Fully Open' || tool.openness.level === 'Mostly Open'
    ).length
    
    const fullyOpenTools = tools.filter(tool => 
      tool.openness.level === 'Fully Open'
    ).length
    
    const openPercentage = tools.length > 0 ? Math.round((openTools / tools.length) * 100) : 0
    
    return {
      totalTools: tools.length,
      embeddableTools,
      totalCategories: uniqueCategories,
      totalOrganizations: uniqueOrganizations,
      openToolsPercentage: openPercentage,
      fullyOpenTools
    }
  }
  
  async searchTools(searchTerm: string): Promise<Tool[]> {
    return this.getTools({ searchTerm })
  }
}

// Export singleton instance
export const toolRepository: ToolRepository = new SupabaseToolRepository()