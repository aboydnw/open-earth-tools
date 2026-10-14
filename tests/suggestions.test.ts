import { beforeEach, describe, expect, it } from 'vitest'
import { AdminError } from '@/lib/admin/tools'
import {
  MAX_PENDING_SUGGESTIONS,
  approveSuggestion,
  listSuggestions,
  rejectSuggestion,
  suggestTool,
} from '@/lib/suggestions'
import { loadTools } from '@/lib/tools-data'
import { getTool, insertTool, listTools, type SqlDatabase } from '@/lib/tools-repo'
import { createTestDatabase } from './sqlite'

const NOW = new Date('2026-10-14T12:00:00Z')
const existing = loadTools()[0]
const pass = async () => true

let db: SqlDatabase

const suggestion = (overrides: Record<string, unknown> = {}) => ({
  name: 'Coral Reef Watch',
  url: 'https://coralreefwatch.example.org/',
  description: 'Satellite monitoring of coral bleaching heat stress.',
  dataTypes: ['ocean'],
  functionality: ['monitoring'],
  turnstileToken: 'token',
  ...overrides,
})

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

describe('suggestTool', () => {
  it('stores the suggestion without adding the tool', async () => {
    await suggestTool(db, suggestion(), pass, NOW)

    const [pending] = await listSuggestions(db)
    expect(pending).toMatchObject({ name: 'Coral Reef Watch', createdAt: NOW.toISOString() })
    expect(pending).not.toHaveProperty('turnstileToken')
    expect(await listTools(db)).toHaveLength(1)
  })

  it('is refused when the bot check fails', async () => {
    const error = await rejection(suggestTool(db, suggestion(), async () => false, NOW))
    expect(error.status).toBe(403)
    expect(await listSuggestions(db)).toEqual([])
  })

  it('checks the token it was given', async () => {
    const seen: string[] = []
    await suggestTool(db, suggestion({ turnstileToken: 'abc' }), async (token) => {
      seen.push(token)
      return true
    }, NOW)
    expect(seen).toEqual(['abc'])
  })

  it.each([
    ['a missing bot-check token', { turnstileToken: undefined }],
    ['a non-http URL', { url: 'javascript:alert(1)' }],
    ['an unknown data type', { dataTypes: ['gossip'] }],
    ['an unexpected field', { organization: 'Sneaky' }],
  ])('is refused for %s', async (_label, overrides) => {
    expect((await rejection(suggestTool(db, suggestion(overrides), pass, NOW))).status).toBe(400)
  })

  it('is refused for a tool already in the directory', async () => {
    const byUrl = await rejection(suggestTool(db, suggestion({ url: existing.url }), pass, NOW))
    const byName = await rejection(suggestTool(db, suggestion({ name: existing.name }), pass, NOW))
    expect([byUrl.status, byName.status]).toEqual([409, 409])
  })

  it('is refused for a tool already waiting for review', async () => {
    await suggestTool(db, suggestion(), pass, NOW)
    const error = await rejection(
      suggestTool(db, suggestion({ name: 'Another Name', url: 'https://www.coralreefwatch.example.org' }), pass, NOW)
    )
    expect(error.status).toBe(409)
  })

  it('is refused once the pending list is full', async () => {
    for (let i = 0; i < MAX_PENDING_SUGGESTIONS; i++) {
      await suggestTool(db, suggestion({ name: `Tool ${i}`, url: `https://example.org/${i}` }), pass, NOW)
    }
    const error = await rejection(
      suggestTool(db, suggestion({ name: 'One Too Many', url: 'https://example.org/extra' }), pass, NOW)
    )
    expect(error.status).toBe(429)
  })
})

describe('approveSuggestion', () => {
  it('adds the scored tool and clears the suggestion', async () => {
    await suggestTool(db, suggestion(), pass, NOW)
    const [{ id }] = await listSuggestions(db)

    const tool = await approveSuggestion(db, id, NOW)

    expect(tool.id).toBe('coral-reef-watch')
    expect(await getTool(db, 'coral-reef-watch')).toMatchObject({ name: 'Coral Reef Watch' })
    expect(await listSuggestions(db)).toEqual([])
  })

  it('is refused for an unknown suggestion', async () => {
    expect((await rejection(approveSuggestion(db, 999, NOW))).status).toBe(404)
    expect((await rejection(approveSuggestion(db, Number('abc'), NOW))).status).toBe(404)
  })
})

describe('rejectSuggestion', () => {
  it('discards the suggestion without adding the tool', async () => {
    await suggestTool(db, suggestion(), pass, NOW)
    const [{ id }] = await listSuggestions(db)

    await rejectSuggestion(db, id)

    expect(await listSuggestions(db)).toEqual([])
    expect(await getTool(db, 'coral-reef-watch')).toBeNull()
  })

  it('is refused for an unknown suggestion', async () => {
    expect((await rejection(rejectSuggestion(db, 999))).status).toBe(404)
  })
})
