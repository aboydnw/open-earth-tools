import { NextResponse } from 'next/server'
import { workerEnv } from '@/lib/cloudflare'
import { isAdminRequest } from './access'
import { AdminError } from './tools'

/** Run an action and turn its outcome into a JSON response. */
export async function respond(
  request: Request,
  run: (body: unknown) => Promise<unknown>,
  successStatus = 200
): Promise<NextResponse> {
  try {
    const body = request.method === 'DELETE' ? null : await request.json().catch(() => null)
    const data = await run(body)
    return NextResponse.json({ success: true, data: data ?? null }, { status: successStatus })
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('Request failed:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * Run an admin action for an authenticated request and turn its outcome into a JSON response.
 * Requests without a valid Cloudflare Access token get a 403 before anything runs.
 */
export async function respondAsAdmin(
  request: Request,
  run: (body: unknown) => Promise<unknown>,
  successStatus = 200
): Promise<NextResponse> {
  if (!(await isAdminRequest(request.headers, workerEnv))) {
    return NextResponse.json({ success: false, error: 'Not authorized.' }, { status: 403 })
  }
  return respond(request, run, successStatus)
}
