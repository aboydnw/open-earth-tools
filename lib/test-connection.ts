import { createClient } from '@supabase/supabase-js'

// Test Supabase connection
export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined')
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Test simple query first
    console.log('Testing basic connection...')
    const { data, error } = await supabase.from('tools').select('id, name').limit(1)
    
    if (error) {
      console.error('Supabase query error:', error)
      // Create a serializable error object
      throw new Error(`Supabase error: ${error.message || error.code || JSON.stringify(error)}`)
    }
    
    console.log('Connection successful! Sample data:', data)
    return { success: true, data, count: data?.length || 0 }
    
  } catch (error) {
    console.error('Connection failed:', error)
    
    // Create a detailed, serializable error
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      supabaseUrl: supabaseUrl ? 'set' : 'missing',
      supabaseKey: supabaseAnonKey ? 'set' : 'missing'
    }
    
    throw new Error(`Connection failed: ${JSON.stringify(errorDetails)}`)
  }
}
