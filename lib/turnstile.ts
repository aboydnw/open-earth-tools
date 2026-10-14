const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Check a Cloudflare Turnstile token with Cloudflare. Tokens are single-use. */
export async function verifyTurnstile(secret: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    })
    const result = await response.json()
    return result.success === true
  } catch {
    return false
  }
}
