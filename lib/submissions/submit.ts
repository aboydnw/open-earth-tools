import type { z } from 'zod'
import { ToolAutomation } from '@/lib/automation/tool-automation'
import {
  SLUG_PATTERN,
  addSubmissionSchema,
  deleteSubmissionSchema,
  editSubmissionSchema,
  toolFileSchema,
  type ToolFile,
} from '@/lib/tool-schema'
import { loadTools, toolFilePath } from '@/lib/tools-data'
import { generateIdFromName, normalizeUrl } from '@/lib/utils'
import { getSubmissionConfig, type SubmissionConfig } from './config'
import {
  SUBMISSION_BRANCH_PREFIX,
  getFile,
  listOpenSubmissions,
  openPullRequest,
  type OpenSubmission,
  type PullRequestDraft,
} from './github'
import { verifyTurnstile } from './turnstile'
import { isReachable } from './url-check'

export const MAX_OPEN_SUBMISSIONS = 10

export type SubmissionAction = 'add' | 'edit' | 'delete'

export interface SubmissionResult {
  /** Link to the pull request, present only when the repository is public. */
  prUrl?: string
}

/** A submission that was refused, with the HTTP status to return. */
export class SubmissionError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

/** Branch name for a submission. The timestamp keeps it unique after earlier branches are merged. */
export function branchName(action: SubmissionAction, slug: string, now: Date): string {
  return `${SUBMISSION_BRANCH_PREFIX}${action}/${slug}/${now.getTime().toString(36)}`
}

/** Hidden marker placed in an "add" PR body so later submissions of the same URL can be spotted. */
export function urlMarker(url: string): string {
  return `<!-- submission-url:${encodeURIComponent(normalizeUrl(url))} -->`
}

/** The error for a new submission that clashes with the ones already waiting for review, or null. */
export function findConflict(
  open: OpenSubmission[],
  action: SubmissionAction,
  slug: string,
  url?: string
): SubmissionError | null {
  if (open.length >= MAX_OPEN_SUBMISSIONS) {
    return new SubmissionError(
      429,
      'Too many submissions are waiting for review. Please try again later.'
    )
  }
  const touchesTool = (submission: OpenSubmission, actions: SubmissionAction[]) =>
    actions.some((a) => submission.branch.startsWith(`${SUBMISSION_BRANCH_PREFIX}${a}/${slug}/`))
  if (action === 'add') {
    const marker = url ? urlMarker(url) : null
    const duplicate = open.some(
      (submission) =>
        touchesTool(submission, ['add']) || (marker !== null && submission.body.includes(marker))
    )
    return duplicate
      ? new SubmissionError(409, 'This tool has already been submitted and is waiting for review.')
      : null
  }
  return open.some((submission) => touchesTool(submission, ['edit', 'delete']))
    ? new SubmissionError(409, 'This tool already has a change waiting for review.')
    : null
}

function inlineCode(value: string): string {
  return `\`${value.replace(/[`\r\n]/g, ' ')}\``
}

function serialize(tool: ToolFile): string {
  return JSON.stringify(tool, null, 2) + '\n'
}

function today(now: Date): string {
  return now.toISOString().slice(0, 10)
}

function parseBody<S extends z.ZodTypeAny>(schema: S, body: unknown): z.infer<S> {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    throw new SubmissionError(400, `Invalid ${issue.path.join('.') || 'request'}: ${issue.message}`)
  }
  return parsed.data
}

async function authorize(turnstileToken: string): Promise<SubmissionConfig> {
  const config = getSubmissionConfig()
  if (!config) {
    throw new SubmissionError(503, 'Submissions are not enabled.')
  }
  if (!(await verifyTurnstile(config.turnstileSecret, turnstileToken))) {
    throw new SubmissionError(403, 'Verification failed. Please try again.')
  }
  return config
}

async function requireReachable(url: string): Promise<void> {
  if (!(await isReachable(url))) {
    throw new SubmissionError(422, `We could not reach ${url}. Please check the address.`)
  }
}

async function requireNoConflict(
  config: SubmissionConfig,
  action: SubmissionAction,
  slug: string,
  url?: string
): Promise<void> {
  const conflict = findConflict(await listOpenSubmissions(config), action, slug, url)
  if (conflict) {
    throw conflict
  }
}

async function requireExistingFile(config: SubmissionConfig, slug: string) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new SubmissionError(404, 'Tool not found.')
  }
  const file = await getFile(config, toolFilePath(slug))
  if (!file) {
    throw new SubmissionError(404, 'Tool not found.')
  }
  return file
}

async function open(config: SubmissionConfig, draft: PullRequestDraft): Promise<SubmissionResult> {
  const pull = await openPullRequest(config, draft)
  return pull.isPublic ? { prUrl: pull.url } : {}
}

/** Open a pull request that adds a new tool, with automated scoring applied. */
export async function submitAdd(body: unknown, now = new Date()): Promise<SubmissionResult> {
  const { turnstileToken, ...raw } = parseBody(addSubmissionSchema, body)
  const config = await authorize(turnstileToken)

  const slug = generateIdFromName(raw.name)
  if (!SLUG_PATTERN.test(slug)) {
    throw new SubmissionError(400, 'The tool name must contain letters or numbers.')
  }
  const urlKey = normalizeUrl(raw.url)
  const alreadyListed = loadTools().some(
    (tool) => tool.id === slug || normalizeUrl(tool.url) === urlKey
  )
  if (alreadyListed) {
    throw new SubmissionError(409, 'This tool is already in the directory.')
  }
  await requireReachable(raw.url)
  await requireNoConflict(config, 'add', slug, raw.url)
  if (await getFile(config, toolFilePath(slug))) {
    throw new SubmissionError(409, 'This tool is already in the directory.')
  }

  const scored = await new ToolAutomation().processRawTool(raw)
  const tool = toolFileSchema.parse({
    ...scored,
    openness: { ...scored.openness, assessedAt: today(now) },
    addedAt: today(now),
  })

  return open(config, {
    branch: branchName('add', slug, now),
    title: `Add tool: ${raw.name}`,
    commitMessage: `feat(data): add ${raw.name}`,
    path: toolFilePath(slug),
    content: serialize(tool),
    body: [
      'Submitted through the directory form.',
      '',
      `- **Tool:** ${inlineCode(raw.name)}`,
      `- **URL:** ${inlineCode(raw.url)}`,
      `- **Data types:** ${raw.dataTypes.join(', ')}`,
      `- **Functionality:** ${raw.functionality.join(', ')}`,
      '',
      'Organization, category, license, embed support, and the openness assessment were filled in by automated scoring. Please check them before merging.',
      '',
      urlMarker(raw.url),
    ].join('\n'),
  })
}

/** Open a pull request that replaces an existing tool's editable fields. */
export async function submitEdit(
  slug: string,
  body: unknown,
  now = new Date()
): Promise<SubmissionResult> {
  const { turnstileToken, ...changes } = parseBody(editSubmissionSchema, body)
  const config = await authorize(turnstileToken)

  const file = await requireExistingFile(config, slug)
  const current = toolFileSchema.parse(JSON.parse(file.content))
  if (normalizeUrl(changes.url) !== normalizeUrl(current.url)) {
    await requireReachable(changes.url)
  }
  await requireNoConflict(config, 'edit', slug)

  const { assessedAt, ...currentAssessment } = current.openness
  const assessmentChanged = JSON.stringify(changes.openness) !== JSON.stringify(currentAssessment)
  const { embedNote, ...rest } = changes
  const updated = toolFileSchema.parse({
    ...current,
    ...rest,
    embedNote: embedNote || undefined,
    openness: {
      ...changes.openness,
      assessedAt: assessmentChanged ? today(now) : assessedAt,
    },
  })
  if (serialize(updated) === serialize(current)) {
    throw new SubmissionError(400, 'No changes to submit.')
  }

  return open(config, {
    branch: branchName('edit', slug, now),
    title: `Edit tool: ${current.name}`,
    commitMessage: `fix(data): update ${current.name}`,
    path: toolFilePath(slug),
    content: serialize(updated),
    existingSha: file.sha,
    body: `Edit to ${inlineCode(current.name)} submitted through the directory form.`,
  })
}

/** Open a pull request that removes a tool. */
export async function submitDelete(
  slug: string,
  body: unknown,
  now = new Date()
): Promise<SubmissionResult> {
  const { turnstileToken, reason } = parseBody(deleteSubmissionSchema, body)
  const config = await authorize(turnstileToken)

  const file = await requireExistingFile(config, slug)
  const current = toolFileSchema.parse(JSON.parse(file.content))
  await requireNoConflict(config, 'delete', slug)

  return open(config, {
    branch: branchName('delete', slug, now),
    title: `Remove tool: ${current.name}`,
    commitMessage: `fix(data): remove ${current.name}`,
    path: toolFilePath(slug),
    content: null,
    existingSha: file.sha,
    body: [
      `Removal of ${inlineCode(current.name)} requested through the directory form.`,
      '',
      `**Reason given:** ${reason ? inlineCode(reason) : 'none'}`,
    ].join('\n'),
  })
}
