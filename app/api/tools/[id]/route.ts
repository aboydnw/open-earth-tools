import { NextRequest, NextResponse } from 'next/server'
import { toolsDb } from '@/lib/database'

// GET /api/tools/[id] - Get a specific tool
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tool = await toolsDb.getTool(id)
    
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
    console.error('GET /api/tools/[id] error:', error)
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Check if tool exists
    const existingTool = await toolsDb.getTool(id)
    if (!existingTool) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tool not found' 
        },
        { status: 404 }
      )
    }
    
    const updatedTool = await toolsDb.updateTool(id, body)
    
    return NextResponse.json({ 
      success: true, 
      data: updatedTool 
    })
  } catch (error) {
    console.error('PUT /api/tools/[id] error:', error)
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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Check if tool exists
    const existingTool = await toolsDb.getTool(id)
    if (!existingTool) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tool not found' 
        },
        { status: 404 }
      )
    }
    
    await toolsDb.deleteTool(id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tool deleted successfully' 
    })
  } catch (error) {
    console.error('DELETE /api/tools/[id] error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
