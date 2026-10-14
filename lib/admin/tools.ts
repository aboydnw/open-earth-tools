import type { z } from 'zod'
import { ToolAutomation } from '@/lib/automation/tool-automation'
import { SLUG_PATTERN, addToolSchema, editToolSchema, toolFileSchema } from '@/lib/tool-schema'
import { deleteTool, getTool, insertTool, listTools, updateTool, type SqlDatabase } from '@/lib/tools-repo'
import type { Tool } from '@/lib/types'
import { generateIdFromName, normalizeUrl } from '@/lib/utils'

/** A request that was refused, with the HTTP status to return. */
export class AdminError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

function parseBody<S extends z.ZodTypeAny>(schema: S, body: unknown): z.infer<S> {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    throw new AdminError(400, `Invalid ${issue.path.join('.') || 'request'}: ${issue.message}`)
  }
  return parsed.data
}

function today(now: Date): string {
  return now.toISOString().slice(0, 10)
}

async function requireTool(db: SqlDatabase, id: string): Promise<Tool> {
  const tool = SLUG_PATTERN.test(id) ? await getTool(db, id) : null
  if (!tool) {
    throw new AdminError(404, 'Tool not found.')
  }
  return tool
}

/** Add a tool from the short form, filling in the rest with automated scoring. */
export async function addTool(db: SqlDatabase, body: unknown, now = new Date()): Promise<Tool> {
  const raw = parseBody(addToolSchema, body)
  const id = generateIdFromName(raw.name)
  if (!SLUG_PATTERN.test(id)) {
    throw new AdminError(400, 'The tool name must contain letters or numbers.')
  }
  const urlKey = normalizeUrl(raw.url)
  const existing = await listTools(db)
  if (existing.some((tool) => tool.id === id || normalizeUrl(tool.url) === urlKey)) {
    throw new AdminError(409, 'This tool is already in the directory.')
  }

  const scored = await new ToolAutomation().processRawTool(raw)
  const tool = toolFileSchema.parse({
    ...scored,
    openness: { ...scored.openness, assessedAt: today(now) },
    addedAt: today(now),
  })
  if (!(await insertTool(db, id, tool, now))) {
    throw new AdminError(409, 'This tool is already in the directory.')
  }
  return { id, ...tool }
}

/** Replace a tool's editable fields, keeping the ones the form does not show. */
export async function editTool(
  db: SqlDatabase,
  id: string,
  body: unknown,
  now = new Date()
): Promise<Tool> {
  const changes = parseBody(editToolSchema, body)
  const { id: _, ...current } = await requireTool(db, id)

  const { assessedAt, ...currentAssessment } = current.openness
  const assessmentChanged = JSON.stringify(changes.openness) !== JSON.stringify(currentAssessment)
  const { embedNote, ...rest } = changes
  const updated = toolFileSchema.parse({
    ...current,
    ...rest,
    embedNote: embedNote || undefined,
    openness: {
      ...changes.openness,
      assessedAt: assessmentChanged ? today(now) : assessedAt,
    },
  })
  if (!(await updateTool(db, id, updated, now))) {
    throw new AdminError(404, 'Tool not found.')
  }
  return { id, ...updated }
}

/** Remove a tool. */
export async function removeTool(db: SqlDatabase, id: string): Promise<void> {
  await requireTool(db, id)
  await deleteTool(db, id)
}
