import { NextRequest } from 'next/server'
import { respondAsAdmin } from '@/lib/admin/respond'
import { editTool, removeTool } from '@/lib/admin/tools'
import { workerEnv } from '@/lib/cloudflare'

type RouteContext = { params: Promise<{ id: string }> }

// PUT /api/admin/tools/[id] - Edit a tool
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return respondAsAdmin(request, (body) => editTool(workerEnv.DB, id, body))
}

// DELETE /api/admin/tools/[id] - Delete a tool
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return respondAsAdmin(request, () => removeTool(workerEnv.DB, id))
}
