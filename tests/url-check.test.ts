import { describe, expect, it } from 'vitest'
import { isPublicAddress } from '@/lib/submissions/url-check'

describe('isPublicAddress', () => {
  it.each(['8.8.8.8', '140.82.112.3', '2606:4700:4700::1111'])('accepts %s', (address) => {
    expect(isPublicAddress(address)).toBe(true)
  })

  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '192.168.1.1',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '::1',
    '::',
    'fd00::1',
    'fe80::1',
    '::ffff:127.0.0.1',
    '::ffff:10.0.0.1',
    'not-an-ip',
  ])('rejects %s', (address) => {
    expect(isPublicAddress(address)).toBe(false)
  })
})
