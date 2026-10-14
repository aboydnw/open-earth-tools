import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'self' https://kepler.gl https://observablehq.com https://food.theplotline.org https://foodtwin.theplotline.org https://www.earthdata.nasa.gov https://worldview.earthdata.nasa.gov https://dashboard.waterdata.usgs.gov https://oceancolor.gsfc.nasa.gov https://embed.windy.com https://earthquake.usgs.gov https://toolkit.climate.gov",
      "frame-ancestors 'self'",
    ].join('; ')
  )

  // X-Frame-Options (legacy support)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // X-XSS-Protection (legacy)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
