// Print SQL that makes the D1 `tools` table match data/tools/*.json exactly.
// Existing rows with the same id are overwritten, and rows with no file are deleted.
//
//   node scripts/seed-sql.mjs > seed.sql
//   npx wrangler d1 execute open-earth-tools --remote --file seed.sql

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TOOLS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'tools')

function quote(value) {
  return `'${value.replaceAll("'", "''")}'`
}

/** Build the SQL that makes the `tools` table match the tool files in `dir`. */
export function seedSql(dir = TOOLS_DIR, now = new Date()) {
  const timestamp = now.toISOString()
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort()
  if (files.length === 0) {
    throw new Error(`No tool files in ${dir}; refusing to empty the table.`)
  }
  const ids = files.map((file) => file.slice(0, -'.json'.length))
  const upserts = files.map((file, index) => {
    const tool = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    const createdAt = tool.addedAt ? `${tool.addedAt}T00:00:00.000Z` : timestamp
    return (
      `INSERT INTO tools (id, data, created_at, updated_at) VALUES ` +
      `(${quote(ids[index])}, ${quote(JSON.stringify(tool))}, ${quote(createdAt)}, ${quote(timestamp)}) ` +
      `ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;`
    )
  })
  const prune = `DELETE FROM tools WHERE id NOT IN (${ids.map(quote).join(', ')});`
  return [...upserts, prune].join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(seedSql() + '\n')
}
