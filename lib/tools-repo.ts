import { toolFileSchema, type ToolFile } from './tool-schema'
import type { Tool } from './types'

/** The subset of Cloudflare's D1 API this module uses, so tests can pass a local SQLite instead. */
export interface SqlDatabase {
  prepare(query: string): SqlStatement
}

export interface SqlStatement {
  bind(...values: unknown[]): SqlStatement
  all<T>(): Promise<{ results: T[] }>
  first<T>(): Promise<T | null>
  run(): Promise<{ meta: { changes: number } }>
}

interface ToolRow {
  id: string
  data: string
}

function toTool(row: ToolRow): Tool {
  return { id: row.id, ...toolFileSchema.parse(JSON.parse(row.data)) }
}

function serialize(tool: ToolFile): string {
  return JSON.stringify(toolFileSchema.parse(tool))
}

/** Every tool, sorted by name. */
export async function listTools(db: SqlDatabase): Promise<Tool[]> {
  const { results } = await db.prepare('SELECT id, data FROM tools').all<ToolRow>()
  return results.map(toTool).sort((a, b) => a.name.localeCompare(b.name))
}

/** One tool, or null if no tool has that id. */
export async function getTool(db: SqlDatabase, id: string): Promise<Tool | null> {
  const row = await db.prepare('SELECT id, data FROM tools WHERE id = ?').bind(id).first<ToolRow>()
  return row ? toTool(row) : null
}

/** Insert a tool. Returns false if the id is already taken. */
export async function insertTool(
  db: SqlDatabase,
  id: string,
  tool: ToolFile,
  now: Date
): Promise<boolean> {
  const timestamp = now.toISOString()
  const { meta } = await db
    .prepare(
      'INSERT INTO tools (id, data, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO NOTHING'
    )
    .bind(id, serialize(tool), timestamp, timestamp)
    .run()
  return meta.changes > 0
}

/** Replace a tool's data. Returns false if no tool has that id. */
export async function updateTool(
  db: SqlDatabase,
  id: string,
  tool: ToolFile,
  now: Date
): Promise<boolean> {
  const { meta } = await db
    .prepare('UPDATE tools SET data = ?, updated_at = ? WHERE id = ?')
    .bind(serialize(tool), now.toISOString(), id)
    .run()
  return meta.changes > 0
}

/** Delete a tool. Returns false if no tool has that id. */
export async function deleteTool(db: SqlDatabase, id: string): Promise<boolean> {
  const { meta } = await db.prepare('DELETE FROM tools WHERE id = ?').bind(id).run()
  return meta.changes > 0
}
