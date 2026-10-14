import type { z } from 'zod'
import { AdminError, addTool } from '@/lib/admin/tools'
import { addToolSchema, suggestToolSchema } from '@/lib/tool-schema'
import { listTools, type SqlDatabase } from '@/lib/tools-repo'
import type { Tool } from '@/lib/types'
import { generateIdFromName, normalizeUrl } from '@/lib/utils'

export const MAX_PENDING_SUGGESTIONS = 25

export type SuggestionFields = z.infer<typeof addToolSchema>

/** A tool someone has suggested, waiting for an admin to approve or reject it. */
export type Suggestion = SuggestionFields & { id: number; createdAt: string }

interface SuggestionRow {
  id: number
  data: string
  created_at: string
}

function toSuggestion(row: SuggestionRow): Suggestion {
  return { id: row.id, createdAt: row.created_at, ...addToolSchema.parse(JSON.parse(row.data)) }
}

/** Pending suggestions, oldest first. */
export async function listSuggestions(db: SqlDatabase): Promise<Suggestion[]> {
  const { results } = await db
    .prepare('SELECT id, data, created_at FROM suggestions ORDER BY id')
    .all<SuggestionRow>()
  return results.map(toSuggestion)
}

async function requireSuggestion(db: SqlDatabase, id: number): Promise<Suggestion> {
  const row = Number.isSafeInteger(id)
    ? await db
        .prepare('SELECT id, data, created_at FROM suggestions WHERE id = ?')
        .bind(id)
        .first<SuggestionRow>()
    : null
  if (!row) {
    throw new AdminError(404, 'Suggestion not found.')
  }
  return toSuggestion(row)
}

async function deleteSuggestion(db: SqlDatabase, id: number): Promise<void> {
  await db.prepare('DELETE FROM suggestions WHERE id = ?').bind(id).run()
}

/**
 * Store a public suggestion for review, after the bot check and duplicate checks.
 * `verify` checks the Turnstile token; it is passed in so tests do not call Cloudflare.
 */
export async function suggestTool(
  db: SqlDatabase,
  body: unknown,
  verify: (token: string) => Promise<boolean>,
  now = new Date()
): Promise<void> {
  const parsed = suggestToolSchema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    throw new AdminError(400, `Invalid ${issue.path.join('.') || 'request'}: ${issue.message}`)
  }
  const { turnstileToken, ...fields } = parsed.data
  if (!(await verify(turnstileToken))) {
    throw new AdminError(403, 'Verification failed. Please try again.')
  }

  const slug = generateIdFromName(fields.name)
  const urlKey = normalizeUrl(fields.url)
  const matches = (tool: { name: string; url: string }) =>
    generateIdFromName(tool.name) === slug || normalizeUrl(tool.url) === urlKey

  if ((await listTools(db)).some(matches)) {
    throw new AdminError(409, 'This tool is already in the directory.')
  }
  const pending = await listSuggestions(db)
  if (pending.some(matches)) {
    throw new AdminError(409, 'This tool has already been suggested and is waiting for review.')
  }
  if (pending.length >= MAX_PENDING_SUGGESTIONS) {
    throw new AdminError(429, 'Too many suggestions are waiting for review. Please try again later.')
  }

  await db
    .prepare('INSERT INTO suggestions (data, created_at) VALUES (?, ?)')
    .bind(JSON.stringify(fields), now.toISOString())
    .run()
}

/** Add a suggested tool to the directory, with automated scoring, and clear the suggestion. */
export async function approveSuggestion(db: SqlDatabase, id: number, now = new Date()): Promise<Tool> {
  const { id: _, createdAt, ...fields } = await requireSuggestion(db, id)
  const tool = await addTool(db, fields, now)
  await deleteSuggestion(db, id)
  return tool
}

/** Discard a suggestion. */
export async function rejectSuggestion(db: SqlDatabase, id: number): Promise<void> {
  await requireSuggestion(db, id)
  await deleteSuggestion(db, id)
}
