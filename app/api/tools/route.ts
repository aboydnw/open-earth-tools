import { NextRequest } from 'next/server'
import { readJson, respond } from '@/lib/submissions/respond'
import { submitAdd } from '@/lib/submissions/submit'

// POST /api/tools - Open a pull request that adds a tool
export async function POST(request: NextRequest) {
  const body = await readJson(request)
  return respond(() => submitAdd(body))
}
