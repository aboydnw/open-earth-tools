// Write the D1 `tools` table back to data/tools/*.json, removing files for deleted tools.
// Input is the JSON printed by:
//
//   npx wrangler d1 execute open-earth-tools --remote --json \
//     --command "SELECT id, data FROM tools" > rows.json
//   node scripts/export-json.mjs rows.json

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TOOLS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'tools')
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Rows from wrangler's `--json` output, which wraps results in one object per statement. */
export function rowsFromWranglerOutput(output) {
  const results = JSON.parse(output).flatMap((statement) => statement.results ?? [])
  if (results.length === 0) {
    throw new Error('The query returned no tools; refusing to wipe the backup.')
  }
  return results
}

/** Make `dir` hold exactly one file per row. Returns the number of files written and removed. */
export function writeToolFiles(rows, dir = TOOLS_DIR) {
  const ids = new Set()
  for (const { id, data } of rows) {
    if (!SLUG_PATTERN.test(id)) {
      throw new Error(`Refusing to write a file for invalid id: ${id}`)
    }
    ids.add(id)
    fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(JSON.parse(data), null, 2) + '\n')
  }
  let removed = 0
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.json') && !ids.has(file.slice(0, -'.json'.length))) {
      fs.rmSync(path.join(dir, file))
      removed++
    }
  }
  return { written: ids.size, removed }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = process.argv[2]
  if (!input) {
    throw new Error('Usage: node scripts/export-json.mjs <wrangler-output.json>')
  }
  const { written, removed } = writeToolFiles(rowsFromWranglerOutput(fs.readFileSync(input, 'utf8')))
  console.log(`Wrote ${written} tool files, removed ${removed}.`)
}
