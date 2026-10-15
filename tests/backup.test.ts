import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { rowsFromWranglerOutput, writeToolFiles } from '@/scripts/export-json.mjs'
import { seedSql } from '@/scripts/seed-sql.mjs'
import { createTestDatabase } from './sqlite'

const TOOLS_DIR = path.join(import.meta.dirname, '..', 'data', 'tools')
const tempDirs: string[] = []

function tempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oet-backup-'))
  tempDirs.push(dir)
  return dir
}

function readDir(dir: string) {
  return Object.fromEntries(
    fs
      .readdirSync(dir)
      .sort()
      .map((file) => [file, fs.readFileSync(path.join(dir, file), 'utf8')])
  )
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('seed and nightly export', () => {
  it('round-trip the tool files exactly', () => {
    const { sqlite } = createTestDatabase()
    sqlite.exec(seedSql())
    const rows = sqlite.prepare('SELECT id, data FROM tools').all() as { id: string; data: string }[]
    const output = JSON.stringify([{ results: rows, success: true, meta: {} }])

    const dir = tempDir()
    writeToolFiles(rowsFromWranglerOutput(output), dir)

    expect(readDir(dir)).toEqual(readDir(TOOLS_DIR))
  })

  it('deletes rows that have no tool file', () => {
    const { sqlite } = createTestDatabase()
    sqlite.exec(
      `INSERT INTO tools (id, data, created_at, updated_at) VALUES ('gone', '{}', '2025-01-01', '2025-01-01')`
    )
    sqlite.exec(seedSql())
    const ids = sqlite.prepare('SELECT id FROM tools').all() as { id: string }[]

    expect(ids.map((row) => row.id)).not.toContain('gone')
    expect(ids).toHaveLength(fs.readdirSync(TOOLS_DIR).filter((file) => file.endsWith('.json')).length)
  })

  it('refuses to seed from an empty folder', () => {
    expect(() => seedSql(tempDir())).toThrow()
  })

  it('removes files for deleted tools', () => {
    const dir = tempDir()
    fs.writeFileSync(path.join(dir, 'gone.json'), '{}')
    const result = writeToolFiles([{ id: 'kept', data: '{"name":"Kept"}' }], dir)

    expect(result).toEqual({ written: 1, removed: 1 })
    expect(fs.readdirSync(dir)).toEqual(['kept.json'])
  })

  it('refuses to wipe the backup when the query returns nothing', () => {
    expect(() => rowsFromWranglerOutput('[{"results":[],"success":true}]')).toThrow()
  })

  it('refuses ids that could escape the folder', () => {
    expect(() => writeToolFiles([{ id: '../package', data: '{}' }], tempDir())).toThrow()
  })
})
