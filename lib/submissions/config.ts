export interface SubmissionConfig {
  githubToken: string
  repo: string
  baseBranch: string
  turnstileSecret: string
  turnstileSiteKey: string
}

/**
 * Read submission settings from the environment.
 * Returns null unless the GitHub token and both Turnstile keys are set, which switches submissions off.
 */
export function getSubmissionConfig(): SubmissionConfig | null {
  const githubToken = process.env.GITHUB_TOKEN
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (!githubToken || !turnstileSecret || !turnstileSiteKey) {
    return null
  }
  return {
    githubToken,
    turnstileSecret,
    turnstileSiteKey,
    repo: process.env.GITHUB_REPO || 'aboydnw/open-earth-tools',
    baseBranch: process.env.GITHUB_BASE_BRANCH || 'main',
  }
}
