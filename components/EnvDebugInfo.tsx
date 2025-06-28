import { getEnvStatus } from '../lib/env'

export function EnvDebugInfo() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const status = getEnvStatus()
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
      <h3 className="font-medium text-blue-800 mb-2">🔧 Environment Status (Development Mode)</h3>
      <div className="space-y-1 text-blue-700">
        <div>Supabase URL: {status.hasSupabaseUrl ? '✅ Set' : '❌ Missing'}</div>
        <div>Anon Key: {status.hasAnonKey ? '✅ Set' : '❌ Missing'}</div>
        <div>Service Key: {status.hasServiceKey ? '✅ Set' : '⚠️ Optional'}</div>
        <div>Environment: {status.nodeEnv}</div>
        {status.supabaseUrl !== 'Not set' && (
          <div className="text-xs opacity-75">URL: {status.supabaseUrl}</div>
        )}
      </div>
    </div>
  )
}