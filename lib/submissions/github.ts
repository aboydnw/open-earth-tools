import type { SubmissionConfig } from './config'

export const SUBMISSION_BRANCH_PREFIX = 'submission/'

export interface OpenSubmission {
  branch: string
  body: string
}

export interface RepoFile {
  sha: string
  content: string
}

export interface PullRequestDraft {
  branch: string
  title: string
  body: string
  commitMessage: string
  path: string
  /** New file content, or null to delete the file. */
  content: string | null
  /** Blob sha of the file being replaced or deleted. */
  existingSha?: string
}

export interface OpenedPullRequest {
  url: string
  isPublic: boolean
}

class GitHubError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

async function github<T>(
  config: SubmissionConfig,
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`https://api.github.com/repos/${config.repo}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${config.githubToken}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'open-earth-tools-directory',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) {
    throw new GitHubError(response.status, `GitHub ${method} ${path} failed with ${response.status}`)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

/** Open pull requests that were created by the submission forms. */
export async function listOpenSubmissions(config: SubmissionConfig): Promise<OpenSubmission[]> {
  const pulls = await github<{ head: { ref: string }; body: string | null }[]>(
    config,
    'GET',
    '/pulls?state=open&per_page=100'
  )
  return pulls
    .filter((pull) => pull.head.ref.startsWith(SUBMISSION_BRANCH_PREFIX))
    .map((pull) => ({ branch: pull.head.ref, body: pull.body ?? '' }))
}

/** Fetch a file from the base branch, or null if it does not exist. */
export async function getFile(config: SubmissionConfig, path: string): Promise<RepoFile | null> {
  try {
    const file = await github<{ sha: string; content: string }>(
      config,
      'GET',
      `/contents/${path}?ref=${encodeURIComponent(config.baseBranch)}`
    )
    return { sha: file.sha, content: Buffer.from(file.content, 'base64').toString('utf8') }
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) {
      return null
    }
    throw error
  }
}

/** Create a branch with a single file change and open a pull request for it. */
export async function openPullRequest(
  config: SubmissionConfig,
  draft: PullRequestDraft
): Promise<OpenedPullRequest> {
  const base = await github<{ object: { sha: string } }>(
    config,
    'GET',
    `/git/ref/heads/${config.baseBranch}`
  )
  await github(config, 'POST', '/git/refs', {
    ref: `refs/heads/${draft.branch}`,
    sha: base.object.sha,
  })
  try {
    if (draft.content === null) {
      await github(config, 'DELETE', `/contents/${draft.path}`, {
        message: draft.commitMessage,
        sha: draft.existingSha,
        branch: draft.branch,
      })
    } else {
      await github(config, 'PUT', `/contents/${draft.path}`, {
        message: draft.commitMessage,
        content: Buffer.from(draft.content, 'utf8').toString('base64'),
        sha: draft.existingSha,
        branch: draft.branch,
      })
    }
    const pull = await github<{ html_url: string; base: { repo: { private: boolean } } }>(
      config,
      'POST',
      '/pulls',
      { title: draft.title, body: draft.body, head: draft.branch, base: config.baseBranch }
    )
    return { url: pull.html_url, isPublic: !pull.base.repo.private }
  } catch (error) {
    await github(config, 'DELETE', `/git/refs/heads/${draft.branch}`).catch(() => undefined)
    throw error
  }
}
