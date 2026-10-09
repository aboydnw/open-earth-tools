import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toolFileSchema } from '@/lib/tool-schema'
import { loadTools, toolFilePath } from '@/lib/tools-data'
import {
  MAX_OPEN_SUBMISSIONS,
  SubmissionError,
  branchName,
  findConflict,
  submitAdd,
  submitDelete,
  submitEdit,
  urlMarker,
} from '@/lib/submissions/submit'

vi.mock('@/lib/submissions/url-check', () => ({
  isReachable: vi.fn(async (url: string) => !url.includes('unreachable')),
}))

interface FakePull {
  head: { ref: string }
  body: string
  title: string
}

interface Recorded {
  method: string
  path: string
  body?: Record<string, string>
}

const REPO_API = 'https://api.github.com/repos/aboydnw/open-earth-tools'
const NOW = new Date('2026-10-09T12:00:00Z')
const existing = loadTools()[0]

let pulls: FakePull[]
let writes: Recorded[]
let turnstilePasses: boolean
let repoIsPrivate: boolean

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status })
}

function fileOnMain(path: string): Response {
  const tool = loadTools().find((candidate) => toolFilePath(candidate.id) === path)
  if (!tool) {
    return json({ message: 'Not Found' }, 404)
  }
  const { id, ...file } = tool
  const content = Buffer.from(JSON.stringify(file, null, 2) + '\n').toString('base64')
  return json({ sha: `sha-${id}`, content })
}

async function fakeFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const url = String(input)
  if (url.startsWith('https://challenges.cloudflare.com/')) {
    return json({ success: turnstilePasses })
  }
  if (!url.startsWith(REPO_API)) {
    throw new Error(`unexpected request: ${url}`)
  }
  const method = init?.method ?? 'GET'
  const path = url.slice(REPO_API.length)
  const body = init?.body ? JSON.parse(String(init.body)) : undefined
  if (method === 'GET' && path.startsWith('/pulls')) {
    return json(pulls)
  }
  if (method === 'GET' && path.startsWith('/contents/')) {
    return fileOnMain(path.slice('/contents/'.length).split('?')[0])
  }
  if (method === 'GET' && path === '/git/ref/heads/main') {
    return json({ object: { sha: 'main-sha' } })
  }
  writes.push({ method, path, body })
  if (method === 'POST' && path === '/pulls') {
    pulls.push({ head: { ref: body.head }, body: body.body, title: body.title })
    return json({
      html_url: 'https://github.com/aboydnw/open-earth-tools/pull/1',
      base: { repo: { private: repoIsPrivate } },
    })
  }
  return json({})
}

const newTool = () => ({
  name: 'Coral Reef Watch',
  url: 'https://coralreefwatch.example.org/',
  description: 'Satellite monitoring of coral bleaching heat stress.',
  dataTypes: ['ocean', 'satellite imagery'],
  functionality: ['monitoring', 'mapping'],
  turnstileToken: 'token',
})

function editBody(overrides: Record<string, unknown> = {}) {
  const { id, dataLink, embedCode, addedAt, openness, ...editable } = existing
  const { assessedAt, ...assessment } = openness
  return { ...editable, openness: assessment, turnstileToken: 'token', ...overrides }
}

async function rejection(run: Promise<unknown>): Promise<SubmissionError> {
  const error = await run.then(
    () => undefined,
    (thrown) => thrown
  )
  expect(error).toBeInstanceOf(SubmissionError)
  return error
}

beforeEach(() => {
  pulls = []
  writes = []
  turnstilePasses = true
  repoIsPrivate = false
  vi.stubGlobal('fetch', fakeFetch)
  vi.stubEnv('GITHUB_TOKEN', 'test-token')
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
  vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'test-site-key')
  vi.stubEnv('GITHUB_REPO', '')
  vi.stubEnv('GITHUB_BASE_BRANCH', '')
})

describe('submitAdd', () => {
  it('opens a pull request with a valid, scored tool file', async () => {
    const result = await submitAdd(newTool(), NOW)

    expect(result.prUrl).toBe('https://github.com/aboydnw/open-earth-tools/pull/1')
    const [branch, file, pull] = writes
    expect(branch).toMatchObject({ method: 'POST', path: '/git/refs' })
    expect(branch.body?.sha).toBe('main-sha')
    expect(file).toMatchObject({ method: 'PUT', path: '/contents/data/tools/coral-reef-watch.json' })
    expect(file.body?.branch).toBe(branchName('add', 'coral-reef-watch', NOW))
    const written = JSON.parse(Buffer.from(file.body!.content, 'base64').toString('utf8'))
    expect(toolFileSchema.safeParse(written).success).toBe(true)
    expect(written.addedAt).toBe('2026-10-09')
    expect(written.openness.assessedAt).toBe('2026-10-09')
    expect(pull.body?.base).toBe('main')
    expect(pull.body?.body).toContain(urlMarker(newTool().url))
  })

  it('hides the pull request link when the repository is private', async () => {
    repoIsPrivate = true
    expect(await submitAdd(newTool(), NOW)).toEqual({})
  })

  it('is refused when submissions are not configured', async () => {
    vi.stubEnv('GITHUB_TOKEN', '')
    expect((await rejection(submitAdd(newTool(), NOW))).status).toBe(503)
    expect(writes).toEqual([])
  })

  it('is refused when the bot check fails', async () => {
    turnstilePasses = false
    expect((await rejection(submitAdd(newTool(), NOW))).status).toBe(403)
    expect(writes).toEqual([])
  })

  it('is refused for a URL already in the directory', async () => {
    const error = await rejection(submitAdd({ ...newTool(), url: existing.url }, NOW))
    expect(error.status).toBe(409)
  })

  it('is refused for a name already in the directory', async () => {
    const error = await rejection(submitAdd({ ...newTool(), name: existing.name }, NOW))
    expect(error.status).toBe(409)
  })

  it('is refused when the URL cannot be reached', async () => {
    const error = await rejection(
      submitAdd({ ...newTool(), url: 'https://unreachable.example.org/' }, NOW)
    )
    expect(error.status).toBe(422)
    expect(writes).toEqual([])
  })

  it('is refused when the same URL is already waiting for review', async () => {
    await submitAdd(newTool(), NOW)
    const error = await rejection(submitAdd({ ...newTool(), name: 'Another Name' }, NOW))
    expect(error.status).toBe(409)
  })

  it.each([
    ['a missing bot-check token', { turnstileToken: undefined }],
    ['a non-http URL', { url: 'javascript:alert(1)' }],
    ['an unknown data type', { dataTypes: ['gossip'] }],
    ['no functionality', { functionality: [] }],
    ['an unexpected field', { organization: 'Sneaky' }],
    ['a name with no letters or numbers', { name: '!!!' }],
  ])('is refused for %s', async (_label, overrides) => {
    const error = await rejection(submitAdd({ ...newTool(), ...overrides }, NOW))
    expect(error.status).toBe(400)
    expect(writes).toEqual([])
  })
})

describe('submitEdit', () => {
  it('opens a pull request that keeps fields the form does not edit', async () => {
    await submitEdit(existing.id, editBody({ description: 'A clearer description of the tool.' }), NOW)

    const file = writes[1]
    expect(file).toMatchObject({ method: 'PUT', path: `/contents/${toolFilePath(existing.id)}` })
    expect(file.body?.sha).toBe(`sha-${existing.id}`)
    const written = JSON.parse(Buffer.from(file.body!.content, 'base64').toString('utf8'))
    const { id, ...current } = existing
    expect(written).toEqual({ ...current, description: 'A clearer description of the tool.' })
  })

  it('stamps a new assessment date when the assessment changes', async () => {
    const body = editBody()
    const score = body.openness.score === 6 ? 5 : 6
    await submitEdit(existing.id, { ...body, openness: { ...body.openness, score } }, NOW)

    const written = JSON.parse(Buffer.from(writes[1].body!.content, 'base64').toString('utf8'))
    expect(written.openness.assessedAt).toBe('2026-10-09')
  })

  it('is refused when nothing changed', async () => {
    expect((await rejection(submitEdit(existing.id, editBody(), NOW))).status).toBe(400)
    expect(writes).toEqual([])
  })

  it('is refused for an unknown tool', async () => {
    expect((await rejection(submitEdit('no-such-tool', editBody(), NOW))).status).toBe(404)
  })

  it('is refused for an id that is not a slug', async () => {
    expect((await rejection(submitEdit('../../package', editBody(), NOW))).status).toBe(404)
  })

  it('is refused when the tool already has a change waiting', async () => {
    await submitEdit(existing.id, editBody({ description: 'First pending change here.' }), NOW)
    const error = await rejection(
      submitEdit(existing.id, editBody({ description: 'Second pending change here.' }), NOW)
    )
    expect(error.status).toBe(409)
  })
})

describe('submitDelete', () => {
  it('opens a pull request that removes the file', async () => {
    await submitDelete(existing.id, { reason: 'Tool is offline', turnstileToken: 'token' }, NOW)

    expect(writes[1]).toMatchObject({
      method: 'DELETE',
      path: `/contents/${toolFilePath(existing.id)}`,
    })
    expect(writes[1].body?.sha).toBe(`sha-${existing.id}`)
    expect(writes[2].body?.body).toContain('Tool is offline')
  })

  it('keeps markdown in the reason from rendering', async () => {
    await submitDelete(existing.id, { reason: 'see `x`\n@someone', turnstileToken: 'token' }, NOW)
    expect(writes[2].body?.body).toContain('`see  x  @someone`')
  })
})

describe('findConflict', () => {
  const pending = (branch: string) => ({ branch, body: '' })

  it('refuses everything once the cap is reached', () => {
    const open = Array.from({ length: MAX_OPEN_SUBMISSIONS }, (_, i) =>
      pending(`submission/add/tool-${i}/x`)
    )
    expect(findConflict(open, 'edit', 'unrelated')?.status).toBe(429)
  })

  it('does not confuse tools whose slugs share a prefix', () => {
    expect(findConflict([pending('submission/edit/food-twin-2/x')], 'edit', 'food-twin')).toBeNull()
  })

  it('lets an edit through while an unrelated tool is pending', () => {
    expect(findConflict([pending('submission/delete/other/x')], 'edit', 'food-twin')).toBeNull()
  })

  it('blocks a delete while an edit of the same tool is pending', () => {
    expect(findConflict([pending('submission/edit/food-twin/x')], 'delete', 'food-twin')?.status).toBe(409)
  })
})
