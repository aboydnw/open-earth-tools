import { NextRequest, NextResponse } from 'next/server'
import { toolsDb } from '@/lib/database'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/tools/[id] - Get a specific tool
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const tool = await toolsDb.getTool(params.id)
    
    if (!tool) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tool not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: tool 
    })
  } catch (error) {
    console.error(`GET /api/tools/${params.id} error:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/tools/[id] - Update a specific tool
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Check if tool exists
    const existingTool = await toolsDb.getTool(params.id)
    if (!existingTool) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tool not found' 
        },
        { status: 404 }
      )
    }
    
    const updatedTool = await toolsDb.updateTool(params.id, body)
    
    return NextResponse.json({ 
      success: true, 
      data: updatedTool 
    })
  } catch (error) {
    console.error(`PUT /api/tools/${params.id} error:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/tools/[id] - Delete a specific tool
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if tool exists
    const existingTool = await toolsDb.getTool(params.id)
    if (!existingTool) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tool not found' 
        },
        { status: 404 }
      )
    }
    
    await toolsDb.deleteTool(params.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tool deleted successfully' 
    })
  } catch (error) {
    console.error(`DELETE /api/tools/${params.id} error:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
