import { NextRequest, NextResponse } from 'next/server'
import { toolsDb } from '@/lib/database'
import { Tool } from '@/lib/types'
import { ToolAutomation } from '@/lib/automation/tool-automation'

// GET /api/tools - List all tools
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let tools
    if (category) {
      tools = await toolsDb.getToolsByCategory(category)
    } else {
      tools = await toolsDb.getTools()
    }
    
    return NextResponse.json({ 
      success: true, 
      data: tools,
      count: tools.length 
    })
  } catch (error) {
    console.error('GET /api/tools error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// POST /api/tools - Create a new tool
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if this is a raw tool that needs automated assessment
    if (body.needsAutomatedAssessment) {
      // Validate minimal required fields for automation
      const requiredFields = ['name', 'url', 'description']
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Missing required field: ${field}` 
            },
            { status: 400 }
          )
        }
      }

      if (!body.dataTypes || !Array.isArray(body.dataTypes) || body.dataTypes.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'At least one data type must be selected' 
          },
          { status: 400 }
        )
      }

      if (!body.functionality || !Array.isArray(body.functionality) || body.functionality.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'At least one functionality must be selected' 
          },
          { status: 400 }
        )
      }

      // Use automation to process the raw tool data
      const automation = new ToolAutomation()
      const toolData = await automation.processRawTool({
        name: body.name,
        url: body.url,
        description: body.description,
        dataTypes: body.dataTypes,
        functionality: body.functionality
      })
      
      const createdTool = await toolsDb.createTool(toolData)
      
      return NextResponse.json({ 
        success: true, 
        data: createdTool 
      }, { status: 201 })
    }

    // Original manual tool creation logic
    // Validate required fields
    const requiredFields = ['name', 'url', 'description', 'organization', 'license', 'category']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        )
      }
    }

    // Set defaults for optional fields
    const toolData: Omit<Tool, 'id'> = {
      name: body.name,
      url: body.url,
      description: body.description,
      organization: body.organization,
      license: body.license,
      category: body.category,
      embedUrl: body.embedUrl || body.url,
      features: body.features || [],
      icon: body.icon || '🌍',
      status: body.status || 'Production',
      embedSupported: body.embedSupported ?? false,
      embedNote: body.embedNote || '',
      openness: body.openness || {
        score: 0,
        level: 'Minimally Open' as const,
        dimensions: {
          'Software Licensing': { score: 'red' as const, note: 'No assessment' },
          'Data Licensing': { score: 'red' as const, note: 'No assessment' },
          'Technical Accessibility': { score: 'red' as const, note: 'No assessment' },
          'Data Standards': { score: 'red' as const, note: 'No assessment' },
          'Infrastructure': { score: 'red' as const, note: 'No assessment' },
          'Community Governance': { score: 'red' as const, note: 'No assessment' }
        }
      }
    }
    
    const createdTool = await toolsDb.createTool(toolData)
    
    return NextResponse.json({ 
      success: true, 
      data: createdTool 
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/tools error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
