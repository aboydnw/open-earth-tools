import fs from 'node:fs'
import path from 'node:path'
import { SLUG_PATTERN, toolFileSchema } from './tool-schema'
import type { Tool } from './types'

export const TOOLS_DIR = 'data/tools'

/** Repo-relative path of the JSON file for a tool id. */
export function toolFilePath(id: string): string {
  return `${TOOLS_DIR}/${id}.json`
}

/**
 * Read and validate every tool in `data/tools`, sorted by name.
 * Throws if a file is malformed, so a bad file fails the build rather than the live site.
 */
export function loadTools(): Tool[] {
  const dir = path.join(process.cwd(), 'data', 'tools')
  const tools = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const id = file.slice(0, -'.json'.length)
      if (!SLUG_PATTERN.test(id)) {
        throw new Error(`Invalid tool filename: ${file}`)
      }
      const parsed = toolFileSchema.safeParse(
        JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
      )
      if (!parsed.success) {
        throw new Error(`Invalid tool file ${file}: ${parsed.error.message}`)
      }
      return { id, ...parsed.data }
    })
  return tools.sort((a, b) => a.name.localeCompare(b.name))
}

/** Unique categories across the given tools, sorted. */
export function listCategories(tools: Tool[]): string[] {
  return [...new Set(tools.map((tool) => tool.category))].sort()
}
