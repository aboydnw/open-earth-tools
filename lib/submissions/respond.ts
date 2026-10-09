import { NextResponse } from 'next/server'
import { SubmissionError, type SubmissionResult } from './submit'

/** Run a submission and turn its outcome into the API's JSON response. */
export async function respond(run: () => Promise<SubmissionResult>): Promise<NextResponse> {
  try {
    const result = await run()
    return NextResponse.json({ success: true, ...result }, { status: 201 })
  } catch (error) {
    if (error instanceof SubmissionError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('Submission failed:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

/** Parse a request's JSON body, returning null when it is missing or malformed. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}
