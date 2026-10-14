import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'

export const ACCESS_TOKEN_HEADER = 'cf-access-jwt-assertion'

export interface AccessSettings {
  ACCESS_TEAM_DOMAIN?: string
  ACCESS_AUD?: string
  ADMIN_DEV_BYPASS?: string
}

const keySets = new Map<string, JWTVerifyGetKey>()

function teamKeys(teamDomain: string): JWTVerifyGetKey {
  let keys = keySets.get(teamDomain)
  if (!keys) {
    keys = createRemoteJWKSet(new URL(`https://${teamDomain}/cdn-cgi/access/certs`))
    keySets.set(teamDomain, keys)
  }
  return keys
}

function normalizeTeamDomain(value: string): string {
  return value.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

function isLocalHost(host: string | null): boolean {
  const hostname = (host ?? '').replace(/:\d+$/, '')
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

/**
 * Decide whether a request comes from an admin signed in through Cloudflare Access.
 * Checks the token's signature against the team's published keys, its issuer, audience and expiry.
 * Fails closed when Access is not configured. The dev bypass only applies on localhost.
 */
export async function isAdminRequest(
  headers: Headers,
  settings: AccessSettings,
  keys?: JWTVerifyGetKey
): Promise<boolean> {
  if (settings.ADMIN_DEV_BYPASS === 'true' && isLocalHost(headers.get('host'))) {
    return true
  }
  const teamDomain = normalizeTeamDomain(settings.ACCESS_TEAM_DOMAIN ?? '')
  const audience = settings.ACCESS_AUD?.trim()
  const token = headers.get(ACCESS_TOKEN_HEADER)
  if (!teamDomain || !audience || !token) {
    return false
  }
  try {
    await jwtVerify(token, keys ?? teamKeys(teamDomain), {
      issuer: `https://${teamDomain}`,
      audience,
    })
    return true
  } catch {
    return false
  }
}
