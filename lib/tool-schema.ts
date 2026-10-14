import { z } from 'zod'
import { DATA_TYPE_OPTIONS, FUNCTIONALITY_OPTIONS } from './constants'

export const OPENNESS_LEVELS = [
  'Fully Open',
  'Mostly Open',
  'Partially Open',
  'Minimally Open',
] as const

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

const text = (max: number) => z.string().trim().min(1).max(max)
const httpUrl = z.string().trim().max(500).refine(isHttpUrl, 'Must be an http(s) URL')
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const dimensionSchema = z
  .object({
    score: z.enum(['green', 'yellow', 'red']),
    note: z.string().trim().max(300),
  })
  .strict()

const opennessSchema = z
  .object({
    score: z.number().int().min(0).max(6),
    level: z.enum(OPENNESS_LEVELS),
    assessedAt: isoDate.optional(),
    dimensions: z
      .object({
        'Software Licensing': dimensionSchema,
        'Data Licensing': dimensionSchema,
        'Technical Accessibility': dimensionSchema,
        'Data Standards': dimensionSchema,
        Infrastructure: dimensionSchema,
        'Community Governance': dimensionSchema,
      })
      .strict(),
  })
  .strict()

const editableFields = {
  name: text(100),
  organization: text(100),
  description: text(600),
  url: httpUrl,
  embedUrl: httpUrl,
  category: text(60),
  license: text(60),
  status: text(30),
  features: z.array(text(80)).max(8),
  icon: text(10),
  embedSupported: z.boolean(),
  embedNote: z.string().trim().max(300).optional(),
}

/** Shape of a `data/tools/<slug>.json` file. */
export const toolFileSchema = z
  .object({
    ...editableFields,
    dataLink: httpUrl.optional(),
    embedCode: z.string().max(2000).optional(),
    openness: opennessSchema,
    addedAt: isoDate.optional(),
  })
  .strict()

export type ToolFile = z.infer<typeof toolFileSchema>

/** Body of an "add tool" request; the remaining fields are filled in by automated scoring. */
export const addToolSchema = z
  .object({
    name: editableFields.name,
    url: httpUrl,
    description: editableFields.description,
    dataTypes: z.array(z.enum(DATA_TYPE_OPTIONS)).min(1),
    functionality: z.array(z.enum(FUNCTIONALITY_OPTIONS)).min(1),
  })
  .strict()

/** Body of a public "suggest a tool" request: the add form plus a Turnstile token. */
export const suggestToolSchema = addToolSchema.extend({
  turnstileToken: z.string().min(1).max(4096),
})

/** Body of an "edit tool" request. */
export const editToolSchema = z
  .object({
    ...editableFields,
    openness: opennessSchema.omit({ assessedAt: true }),
  })
  .strict()

