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

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n')
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

// Export validated environment
export const env = validateEnv()

// Helper function to check if we're in a server environment
export const isServer = typeof window === 'undefined'

// Helper function to check if required env vars are present for database operations
export function checkDatabaseEnv() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Database configuration is missing. Please check your environment variables.')
  }
}

// Development helper to list current environment status
export function getEnvStatus() {
  return {
    hasSupabaseUrl: !!env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: env.NODE_ENV,
  }
}