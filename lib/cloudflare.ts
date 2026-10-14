import { env } from 'cloudflare:workers'
import type { AccessSettings } from './admin/access'
import type { SqlDatabase } from './tools-repo'

interface WorkerEnv extends AccessSettings {
  DB: SqlDatabase
}

/** The Worker's bindings and variables, as declared in `wrangler.jsonc`. */
export const workerEnv = env as unknown as WorkerEnv
