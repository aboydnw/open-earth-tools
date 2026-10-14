// Print SQL that loads every data/tools/*.json file into the D1 `tools` table.
// Existing rows with the same id are overwritten.
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

/** Build the seed SQL for the tool files in `dir`. */
export function seedSql(dir = TOOLS_DIR, now = new Date()) {
  const timestamp = now.toISOString()
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const id = file.slice(0, -'.json'.length)
      const tool = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
      const createdAt = tool.addedAt ? `${tool.addedAt}T00:00:00.000Z` : timestamp
      return (
        `INSERT INTO tools (id, data, created_at, updated_at) VALUES ` +
        `(${quote(id)}, ${quote(JSON.stringify(tool))}, ${quote(createdAt)}, ${quote(timestamp)}) ` +
        `ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;`
      )
    })
    .join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(seedSql() + '\n')
}
