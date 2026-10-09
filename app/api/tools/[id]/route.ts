import { NextRequest } from 'next/server'
import { readJson, respond } from '@/lib/submissions/respond'
import { submitDelete, submitEdit } from '@/lib/submissions/submit'

type RouteContext = { params: Promise<{ id: string }> }

// PUT /api/tools/[id] - Open a pull request that edits a tool
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await readJson(request)
  return respond(() => submitEdit(id, body))
}

// DELETE /api/tools/[id] - Open a pull request that removes a tool
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await readJson(request)
  return respond(() => submitDelete(id, body))
}
