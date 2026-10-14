import { env } from 'cloudflare:workers'
import type { AccessSettings } from './admin/access'
import type { SqlDatabase } from './tools-repo'

interface WorkerEnv extends AccessSettings {
  DB: SqlDatabase
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_SECRET_KEY?: string
}

/** The Worker's bindings, variables and secrets, as declared in `wrangler.jsonc`. */
export const workerEnv = env as unknown as WorkerEnv

/** The Turnstile site key when public suggestions are set up, otherwise null. */
export function suggestionsSiteKey(): string | null {
  return workerEnv.TURNSTILE_SITE_KEY && workerEnv.TURNSTILE_SECRET_KEY
    ? workerEnv.TURNSTILE_SITE_KEY
    : null
}
