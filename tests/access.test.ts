import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair, type JWTVerifyGetKey } from 'jose'
import { beforeAll, describe, expect, it } from 'vitest'
import { ACCESS_TOKEN_HEADER, isAdminRequest, type AccessSettings } from '@/lib/admin/access'

const TEAM = 'example-team.cloudflareaccess.com'
const AUD = 'test-audience-tag'
const settings: AccessSettings = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD }

let keys: JWTVerifyGetKey
let privateKey: CryptoKey
let otherPrivateKey: CryptoKey

beforeAll(async () => {
  const pair = await generateKeyPair('RS256')
  privateKey = pair.privateKey
  const publicJwk = { ...(await exportJWK(pair.publicKey)), kid: 'k1', alg: 'RS256' }
  keys = createLocalJWKSet({ keys: [publicJwk] })
  otherPrivateKey = (await generateKeyPair('RS256')).privateKey
})

async function token(
  overrides: { issuer?: string; audience?: string; expiresIn?: string; key?: CryptoKey } = {}
) {
  return new SignJWT({ email: 'admin@example.org' })
    .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
    .setIssuer(overrides.issuer ?? `https://${TEAM}`)
    .setAudience(overrides.audience ?? AUD)
    .setIssuedAt()
    .setExpirationTime(overrides.expiresIn ?? '1h')
    .sign(overrides.key ?? privateKey)
}

function requestHeaders(values: Record<string, string>) {
  return new Headers({ host: 'openearthtools.anthonynboyd.com', ...values })
}

describe('isAdminRequest', () => {
  it('accepts a valid Access token', async () => {
    const headers = requestHeaders({ [ACCESS_TOKEN_HEADER]: await token() })
    expect(await isAdminRequest(headers, settings, keys)).toBe(true)
  })

  it('accepts a team domain written as a URL', async () => {
    const headers = requestHeaders({ [ACCESS_TOKEN_HEADER]: await token() })
    expect(
      await isAdminRequest(headers, { ...settings, ACCESS_TEAM_DOMAIN: `https://${TEAM}/` }, keys)
    ).toBe(true)
  })

  it.each([
    ['a missing token', async () => undefined],
    ['the wrong audience', () => token({ audience: 'another-app' })],
    ['the wrong issuer', () => token({ issuer: 'https://evil.cloudflareaccess.com' })],
    ['an expired token', () => token({ expiresIn: '-1m' })],
    ['a token signed by another key', () => token({ key: otherPrivateKey })],
    ['a malformed token', async () => 'not-a-jwt'],
  ])('rejects %s', async (_label, makeToken) => {
    const value = await makeToken()
    const headers = requestHeaders(value ? { [ACCESS_TOKEN_HEADER]: value } : {})
    expect(await isAdminRequest(headers, settings, keys)).toBe(false)
  })

  it('rejects everything when Access is not configured', async () => {
    const headers = requestHeaders({ [ACCESS_TOKEN_HEADER]: await token() })
    expect(await isAdminRequest(headers, { ACCESS_TEAM_DOMAIN: TEAM }, keys)).toBe(false)
    expect(await isAdminRequest(headers, { ACCESS_AUD: AUD }, keys)).toBe(false)
  })

  it('allows the dev bypass on localhost only', async () => {
    const bypass = { ADMIN_DEV_BYPASS: 'true' }
    expect(await isAdminRequest(new Headers({ host: 'localhost:5173' }), bypass, keys)).toBe(true)
    expect(await isAdminRequest(new Headers({ host: '127.0.0.1:8787' }), bypass, keys)).toBe(true)
    expect(await isAdminRequest(requestHeaders({}), bypass, keys)).toBe(false)
    expect(
      await isAdminRequest(new Headers({ host: 'localhost.evil.com' }), bypass, keys)
    ).toBe(false)
  })
})
