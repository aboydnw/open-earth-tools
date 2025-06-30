/**
 * Retroactive Embedding Assessment Update
 * 
 * This script re-assesses all existing tools in the database using the new,
 * more conservative embedding detection logic.
 */

const { toolsDb } = require('../lib/database');

// New embedding rules (copied from updated automation)
const EMBEDDING_RULES = [
  { pattern: /nasa\.gov|usgs\.gov|noaa\.gov|epa\.gov/, canEmbed: false, reason: 'Government domain restrictions' },
  { pattern: /github\.io|netlify\.app|vercel\.app/, canEmbed: true, reason: 'Static hosting platforms typically allow embedding' },
  { pattern: /observable\.com/, canEmbed: true, reason: 'Observable notebooks designed for embedding' },
  { pattern: /codesandbox\.io|codepen\.io/, canEmbed: true, reason: 'Code sharing platforms support embedding' },
  { pattern: /tableau\.com/, canEmbed: true, reason: 'Tableau provides official embed functionality' },
];

function checkEmbedSupport(url) {
  for (const { pattern, canEmbed } of EMBEDDING_RULES) {
    if (pattern.test(url)) {
      return canEmbed;
    }
  }
  // Conservative default: assume NOT embeddable unless explicitly known
  return false;
}

function generateEmbedNote(url, embedSupported) {
  for (const { pattern, reason } of EMBEDDING_RULES) {
    if (pattern.test(url)) {
      return reason;
    }
  }
  return embedSupported 
    ? 'Embedding capabilities need verification' 
    : 'Most modern sites block iframe embedding for security';
}

async function reassessAllTools() {
  console.log('🔄 Starting retroactive embedding assessment update...\n');
  
  try {
    // Get all existing tools
    console.log('📥 Fetching all tools from database...');
    const tools = await toolsDb.getTools();
    console.log(`Found ${tools.length} tools to reassess\n`);
    
    const results = [];
    let changedCount = 0;
    
    for (const tool of tools) {
      console.log(`🔍 Assessing: ${tool.name}`);
      console.log(`   URL: ${tool.url}`);
      
      // Use the new embedding assessment logic
      const newEmbedSupported = checkEmbedSupport(tool.url);
      const newEmbedNote = generateEmbedNote(tool.url, newEmbedSupported);
      
      const result = {
        toolId: tool.id,
        toolName: tool.name,
        url: tool.url,
        oldEmbedSupported: tool.embedSupported,
        newEmbedSupported,
        oldEmbedNote: tool.embedNote || '',
        newEmbedNote,
        changed: tool.embedSupported !== newEmbedSupported || (tool.embedNote || '') !== newEmbedNote
      };
      
      results.push(result);
      
      if (result.changed) {
        changedCount++;
        console.log(`  📝 UPDATE NEEDED:`);
        console.log(`     Embed Support: ${result.oldEmbedSupported} → ${result.newEmbedSupported}`);
        console.log(`     Embed Note: "${result.oldEmbedNote}" → "${result.newEmbedNote}"`);
        
        // Update the tool in the database
        try {
          await toolsDb.updateTool(tool.id, {
            embedSupported: newEmbedSupported,
            embedNote: newEmbedNote
          });
          console.log(`  ✅ Updated successfully`);
        } catch (error) {
          console.error(`  ❌ Failed to update: ${error.message}`);
        }
      } else {
        console.log(`  ✓ No changes needed`);
      }
      console.log('');
    }
    
    // Print summary
    console.log('='.repeat(60));
    console.log('📊 REASSESSMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total tools assessed: ${tools.length}`);
    console.log(`Tools updated: ${changedCount}`);
    console.log(`Tools unchanged: ${tools.length - changedCount}\n`);
    
    if (changedCount > 0) {
      console.log('🔧 CHANGES MADE:');
      const changedResults = results.filter(r => r.changed);
      
      // Group by change type
      const newlyEmbeddable = changedResults.filter(r => !r.oldEmbedSupported && r.newEmbedSupported);
      const newlyNonEmbeddable = changedResults.filter(r => r.oldEmbedSupported && !r.newEmbedSupported);
      const noteOnlyChanges = changedResults.filter(r => 
        r.oldEmbedSupported === r.newEmbedSupported && r.oldEmbedNote !== r.newEmbedNote
      );
      
      if (newlyEmbeddable.length > 0) {
        console.log(`\n✅ ${newlyEmbeddable.length} tools now marked as EMBEDDABLE:`);
        newlyEmbeddable.forEach(r => {
          console.log(`   • ${r.toolName} (${r.url})`);
          console.log(`     Reason: ${r.newEmbedNote}`);
        });
      }
      
      if (newlyNonEmbeddable.length > 0) {
        console.log(`\n❌ ${newlyNonEmbeddable.length} tools now marked as NON-EMBEDDABLE:`);
        newlyNonEmbeddable.forEach(r => {
          console.log(`   • ${r.toolName} (${r.url})`);
          console.log(`     Reason: ${r.newEmbedNote}`);
        });
      }
      
      if (noteOnlyChanges.length > 0) {
        console.log(`\n📝 ${noteOnlyChanges.length} tools with updated notes only:`);
        noteOnlyChanges.forEach(r => {
          console.log(`   • ${r.toolName}`);
          console.log(`     Old: "${r.oldEmbedNote}"`);
          console.log(`     New: "${r.newEmbedNote}"`);
        });
      }
      
      // Show detailed results for verification
      console.log(`\n📋 DETAILED RESULTS:`);
      changedResults.forEach(r => {
        console.log(`\n${r.toolName}:`);
        console.log(`  URL: ${r.url}`);
        console.log(`  Embeddable: ${r.oldEmbedSupported} → ${r.newEmbedSupported}`);
        console.log(`  Note: "${r.oldEmbedNote}" → "${r.newEmbedNote}"`);
      });
    }
    
    console.log('\n🎉 Retroactive assessment update completed successfully!');
    
    // Provide guidance
    console.log('\n💡 WHAT THIS MEANS:');
    console.log('• Tools previously marked as embeddable may now show as non-embeddable');
    console.log('• This reflects more realistic embedding capabilities based on modern web security');
    console.log('• Users will see better fallback messages for tools that cannot embed');
    console.log('• The preview modal will handle embedding failures more gracefully');
    console.log('• Only tools on known embedding-friendly platforms are marked as embeddable');
    
  } catch (error) {
    console.error('❌ Error during reassessment:', error);
    throw error;
  }
}

// Run the reassessment if this script is executed directly
if (require.main === module) {
  reassessAllTools()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { reassessAllTools };
