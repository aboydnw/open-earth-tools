import { beforeEach, describe, expect, it } from 'vitest'
import { AdminError, addTool, editTool, removeTool } from '@/lib/admin/tools'
import { toolFileSchema } from '@/lib/tool-schema'
import { loadTools } from '@/lib/tools-data'
import { getTool, insertTool, listTools, type SqlDatabase } from '@/lib/tools-repo'
import { createTestDatabase } from './sqlite'

const NOW = new Date('2026-10-14T12:00:00Z')
const existing = loadTools()[0]

let db: SqlDatabase

const newTool = () => ({
  name: 'Coral Reef Watch',
  url: 'https://coralreefwatch.example.org/',
  description: 'Satellite monitoring of coral bleaching heat stress.',
  dataTypes: ['ocean', 'satellite imagery'],
  functionality: ['monitoring', 'mapping'],
})

function editBody(overrides: Record<string, unknown> = {}) {
  const { id, dataLink, embedCode, addedAt, openness, ...editable } = existing
  const { assessedAt, ...assessment } = openness
  return { ...editable, openness: assessment, ...overrides }
}

async function rejection(run: Promise<unknown>): Promise<AdminError> {
  const error = await run.then(
    () => undefined,
    (thrown) => thrown
  )
  expect(error).toBeInstanceOf(AdminError)
  return error
}

beforeEach(async () => {
  db = createTestDatabase().db
  const { id, ...file } = existing
  await insertTool(db, id, file, NOW)
})

describe('addTool', () => {
  it('stores a scored tool that shows up in the list', async () => {
    const tool = await addTool(db, newTool(), NOW)

    expect(tool.id).toBe('coral-reef-watch')
    const { id, ...file } = tool
    expect(toolFileSchema.safeParse(file).success).toBe(true)
    expect(tool.addedAt).toBe('2026-10-14')
    expect(tool.openness.assessedAt).toBe('2026-10-14')
    expect((await listTools(db)).map((t) => t.id)).toContain('coral-reef-watch')
  })

  it('is refused for a URL already in the directory', async () => {
    const error = await rejection(addTool(db, { ...newTool(), url: existing.url }, NOW))
    expect(error.status).toBe(409)
  })

  it('is refused for a name already in the directory', async () => {
    const error = await rejection(addTool(db, { ...newTool(), name: existing.name }, NOW))
    expect(error.status).toBe(409)
  })

  it.each([
    ['a non-http URL', { url: 'javascript:alert(1)' }],
    ['an unknown data type', { dataTypes: ['gossip'] }],
    ['no functionality', { functionality: [] }],
    ['an unexpected field', { organization: 'Sneaky' }],
    ['a name with no letters or numbers', { name: '!!!' }],
  ])('is refused for %s', async (_label, overrides) => {
    const error = await rejection(addTool(db, { ...newTool(), ...overrides }, NOW))
    expect(error.status).toBe(400)
    expect(await listTools(db)).toHaveLength(1)
  })
})

describe('editTool', () => {
  it('saves the change and keeps fields the form does not edit', async () => {
    await editTool(db, existing.id, editBody({ description: 'A clearer description of the tool.' }), NOW)

    expect(await getTool(db, existing.id)).toEqual({
      ...existing,
      description: 'A clearer description of the tool.',
    })
  })

  it('clears the embed note when it is emptied', async () => {
    await editTool(db, existing.id, editBody({ embedNote: '' }), NOW)
    expect((await getTool(db, existing.id))?.embedNote).toBeUndefined()
  })

  it('stamps a new assessment date when the assessment changes', async () => {
    const body = editBody()
    const score = body.openness.score === 6 ? 5 : 6
    await editTool(db, existing.id, { ...body, openness: { ...body.openness, score } }, NOW)

    expect((await getTool(db, existing.id))?.openness.assessedAt).toBe('2026-10-14')
  })

  it('keeps the assessment date when the assessment is unchanged', async () => {
    await editTool(db, existing.id, editBody({ name: 'Renamed' }), NOW)
    expect((await getTool(db, existing.id))?.openness.assessedAt).toBe(existing.openness.assessedAt)
  })

  it('is refused for an unknown tool', async () => {
    expect((await rejection(editTool(db, 'no-such-tool', editBody(), NOW))).status).toBe(404)
  })

  it('is refused for an id that is not a slug', async () => {
    expect((await rejection(editTool(db, "x' OR 1=1 --", editBody(), NOW))).status).toBe(404)
  })

  it('is refused for invalid fields', async () => {
    const error = await rejection(editTool(db, existing.id, editBody({ embedUrl: 'ftp://x' }), NOW))
    expect(error.status).toBe(400)
  })
})

describe('removeTool', () => {
  it('deletes the tool', async () => {
    await removeTool(db, existing.id)
    expect(await getTool(db, existing.id)).toBeNull()
  })

  it('is refused for an unknown tool', async () => {
    expect((await rejection(removeTool(db, 'no-such-tool'))).status).toBe(404)
  })
})
