import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import type { SqlDatabase, SqlStatement } from '@/lib/tools-repo'

/** An in-memory SQLite database with the D1 migrations applied, behind the same API the app uses. */
export function createTestDatabase(): { db: SqlDatabase; sqlite: DatabaseSync } {
  const sqlite = new DatabaseSync(':memory:')
  const migrations = path.join(import.meta.dirname, '..', 'migrations')
  for (const file of fs.readdirSync(migrations).sort()) {
    sqlite.exec(fs.readFileSync(path.join(migrations, file), 'utf8'))
  }

  const statement = (query: string, values: unknown[] = []): SqlStatement => ({
    bind: (...next) => statement(query, next),
    all: async <T>() => ({ results: sqlite.prepare(query).all(...(values as SQLInputValue[])) as T[] }),
    first: async <T>() => (sqlite.prepare(query).get(...(values as SQLInputValue[])) as T) ?? null,
    run: async () => ({
      meta: { changes: Number(sqlite.prepare(query).run(...(values as SQLInputValue[])).changes) },
    }),
  })

  return { db: { prepare: (query) => statement(query) }, sqlite }
}
