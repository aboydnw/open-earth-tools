#!/usr/bin/env node

import { runMigration, cleanupMigration } from '../utils/supabase-migration'

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'migrate':
      console.log('🚀 Starting migration to Supabase...')
      await runMigration()
      console.log('✅ Migration completed!')
      break
      
    case 'cleanup':
      console.log('🧹 Cleaning up migration data...')
      await cleanupMigration()
      console.log('✅ Cleanup completed!')
      break
      
    case 'verify':
      console.log('🔍 Verifying migration...')
      const { SupabaseMigration } = await import('../utils/supabase-migration')
      const migration = new SupabaseMigration()
      await migration.verifyMigration()
      break
      
    default:
      console.log('Usage:')
      console.log('  npx tsx scripts/migrate.ts migrate   - Migrate tools to Supabase')
      console.log('  npx tsx scripts/migrate.ts cleanup   - Clean up migrated data')
      console.log('  npx tsx scripts/migrate.ts verify    - Verify migration results')
      process.exit(1)
  }
}

main().catch(console.error)
