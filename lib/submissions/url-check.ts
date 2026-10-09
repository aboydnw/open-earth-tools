import dns from 'node:dns/promises'
import net from 'node:net'

const nonPublic = new net.BlockList()
for (const [prefix, bits] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const) {
  nonPublic.addSubnet(prefix, bits, 'ipv4')
}
for (const [prefix, bits] of [
  ['::', 127],
  ['64:ff9b::', 96],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  nonPublic.addSubnet(prefix, bits, 'ipv6')
}

/** True if the IP address is routable on the public internet. */
export function isPublicAddress(address: string): boolean {
  const family = net.isIP(address)
  if (family === 0) {
    return false
  }
  return !nonPublic.check(address, family === 4 ? 'ipv4' : 'ipv6')
}

/**
 * Check that a submitted URL points at a public host that answers.
 * Any HTTP response counts, since many sites refuse automated requests.
 * Redirects are not followed, so a public URL cannot bounce the check to a private address.
 */
export async function isReachable(url: string): Promise<boolean> {
  try {
    const hostname = new URL(url).hostname.replace(/^\[|\]$/g, '')
    const addresses = await dns.lookup(hostname, { all: true })
    if (addresses.length === 0 || !addresses.every(({ address }) => isPublicAddress(address))) {
      return false
    }
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
      headers: { 'user-agent': 'open-earth-tools-directory link check' },
    })
    await response.body?.cancel()
    return true
  } catch {
    return false
  }
}
