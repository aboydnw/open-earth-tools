import { describe, expect, it } from 'vitest'
import { toolFileSchema } from '@/lib/tool-schema'
import { loadTools } from '@/lib/tools-data'
import { generateIdFromName, listCategories, normalizeUrl } from '@/lib/utils'

const validTool = () => structuredClone(loadTools()[0])

describe('data/tools', () => {
  it('loads every file', () => {
    expect(loadTools().length).toBeGreaterThan(0)
  })

  it('has no two tools with the same URL', () => {
    const urls = loadTools().map((tool) => normalizeUrl(tool.url))
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('lists each category once', () => {
    const categories = listCategories(loadTools())
    expect(new Set(categories).size).toBe(categories.length)
  })
})

describe('toolFileSchema', () => {
  it('rejects non-http URLs', () => {
    const { id, ...tool } = validTool()
    expect(toolFileSchema.safeParse({ ...tool, embedUrl: 'javascript:alert(1)' }).success).toBe(false)
  })

  it('rejects unknown fields', () => {
    const { id, ...tool } = validTool()
    expect(toolFileSchema.safeParse({ ...tool, extra: true }).success).toBe(false)
  })

  it('rejects unknown dimension scores', () => {
    const { id, ...tool } = validTool()
    tool.openness.dimensions.Infrastructure.score = 'purple' as never
    expect(toolFileSchema.safeParse(tool).success).toBe(false)
  })
})

describe('normalizeUrl', () => {
  it('ignores scheme, www, trailing slash and fragment', () => {
    expect(normalizeUrl('http://www.Example.org/tool/#top')).toBe(
      normalizeUrl('https://example.org/tool')
    )
  })

  it('keeps the query string', () => {
    expect(normalizeUrl('https://example.org/?a=1')).not.toBe(normalizeUrl('https://example.org/?a=2'))
  })
})

describe('generateIdFromName', () => {
  it('builds a lowercase hyphenated slug', () => {
    expect(generateIdFromName('  NASA Worldview (v2)! ')).toBe('nasa-worldview-v2')
  })
})
