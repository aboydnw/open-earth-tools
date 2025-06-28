import { checkDatabaseEnv, getEnvStatus } from './env'

// Centralized environment variable access
export function getValidatedEnv() {
  return checkDatabaseEnv()
}

// Environment helpers
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isServer(): boolean {
  return typeof window === 'undefined'
}

// Development logging helper
export function devLog(message: string, data?: any): void {
  if (isDevelopment()) {
    if (data) {
      console.log(message, data)
    } else {
      console.log(message)
    }
  }
}

// Environment status for debugging
export function logEnvStatus(): void {
  if (isDevelopment()) {
    const status = getEnvStatus()
    console.log('🔧 Environment Status:', status)
  }
}