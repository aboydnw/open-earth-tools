import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // Supabase Configuration (Required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  
  // Service role key (optional for client-side, required for migrations)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Parse and validate environment variables with better error handling
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      }).join('\n')
      
      console.error('❌ Environment validation failed:')
      console.error(missingVars)
      console.error('\n💡 Make sure you have a .env.local file with the required variables.')
      console.error('📋 Copy .env.example to .env.local and fill in your Supabase credentials.')
      
      throw new Error(`Missing environment variables. Please check your .env.local file.`)
    }
    throw error
  }
}

// Export validated environment - only validate in server or build context
export const env = (() => {
  // Skip validation during static generation or if explicitly disabled
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    return process.env as any
  }
  
  try {
    return validateEnv()
  } catch (error) {
    // In development, log the error but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Environment validation failed in development mode:')
      console.warn(error instanceof Error ? error.message : String(error))
      return process.env as any // Allow development to continue
    }
    throw error // Fail hard in production
  }
})()

// Helper function to check if we're in a server environment
export const isServer = typeof window === 'undefined'

// Helper function to check if required env vars are present for database operations
export function checkDatabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('Database configuration is missing. Please check your environment variables.')
  }
  
  return { url, key }
}

// Development helper to list current environment status
export function getEnvStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY
  
  return {
    hasSupabaseUrl: !!url,
    hasAnonKey: !!anonKey,
    hasServiceKey: !!serviceKey,
    nodeEnv: process.env.NODE_ENV || env.NODE_ENV,
    supabaseUrl: url ? `${url.substring(0, 20)}...` : 'Not set'
  }
}