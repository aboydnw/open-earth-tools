import { NextRequest } from 'next/server'
import { respondAsAdmin } from '@/lib/admin/respond'
import { addTool } from '@/lib/admin/tools'
import { workerEnv } from '@/lib/cloudflare'

// POST /api/admin/tools - Add a tool
export async function POST(request: NextRequest) {
  return respondAsAdmin(request, (body) => addTool(workerEnv.DB, body), 201)
}
