import { NextRequest } from 'next/server'
import { respondAsAdmin } from '@/lib/admin/respond'
import { workerEnv } from '@/lib/cloudflare'
import { approveSuggestion, rejectSuggestion } from '@/lib/suggestions'

type RouteContext = { params: Promise<{ id: string }> }

// POST /api/admin/suggestions/[id] - Approve a suggestion, adding the tool
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return respondAsAdmin(request, () => approveSuggestion(workerEnv.DB, Number(id)), 201)
}

// DELETE /api/admin/suggestions/[id] - Reject a suggestion
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return respondAsAdmin(request, () => rejectSuggestion(workerEnv.DB, Number(id)))
}
