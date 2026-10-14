import { NextRequest, NextResponse } from 'next/server'
import { respond } from '@/lib/admin/respond'
import { workerEnv } from '@/lib/cloudflare'
import { suggestTool } from '@/lib/suggestions'
import { verifyTurnstile } from '@/lib/turnstile'

// POST /api/suggestions - Suggest a tool for review
export async function POST(request: NextRequest) {
  const secret = workerEnv.TURNSTILE_SECRET_KEY
  if (!secret || !workerEnv.TURNSTILE_SITE_KEY) {
    return NextResponse.json(
      { success: false, error: 'Suggestions are not enabled.' },
      { status: 503 }
    )
  }
  return respond(
    request,
    (body) => suggestTool(workerEnv.DB, body, (token) => verifyTurnstile(secret, token)),
    201
  )
}
