#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import required modules
const path = require('path');
const { pathToFileURL } = require('url');

// Simple test to verify CRUD operations work
async function testCRUD() {
  console.log('🧪 Testing CRUD functionality...\n');
  
  try {
    // Dynamic import for ES modules
    const modulePath = path.join(__dirname, '..', 'lib', 'database.ts');
    const { toolsDb } = await import(pathToFileURL(modulePath).href);
    
    // 1. Test CREATE
    console.log('1️⃣ Testing CREATE...');
    const testTool = {
      name: 'CRUD Test Tool',
      url: 'https://example.com/crud-test',
      description: 'A test tool for verifying CRUD operations.',
      organization: 'Test Organization',
      license: 'MIT',
      category: 'Testing',
      embedUrl: 'https://example.com/crud-test/embed',
      features: ['CRUD Testing', 'Database Operations'],
      icon: '🧪',
      status: 'Testing',
      embedSupported: true,
      embedNote: 'Test embedding',
      openness: {
        score: 3,
        level: 'Partially Open',
        dimensions: {
          'Software Licensing': { score: 'green', note: 'MIT license' },
          'Data Licensing': { score: 'yellow', note: 'Mixed data' },
          'Technical Accessibility': { score: 'green', note: 'Good access' },
          'Data Standards': { score: 'yellow', note: 'Some standards' },
          'Infrastructure': { score: 'red', note: 'Limited hosting' },
          'Community Governance': { score: 'red', note: 'Closed governance' }
        }
      }
    };

    const created = await toolsDb.createTool(testTool);
    console.log(`✅ Created: ${created.name} (ID: ${created.id})`);
    
    const toolId = created.id;

    // 2. Test READ
    console.log('\n2️⃣ Testing READ...');
    const retrieved = await toolsDb.getTool(toolId);
    console.log(`✅ Retrieved: ${retrieved.name}`);
    console.log(`   Features: ${retrieved.features.length} items`);
    console.log(`   Openness: ${retrieved.openness.score}/6`);

    // 3. Test UPDATE
    console.log('\n3️⃣ Testing UPDATE...');
    const updates = {
      description: 'Updated CRUD test tool with new features.',
      features: ['CRUD Testing', 'Database Operations', 'Update Testing'],
      openness: {
        score: 4,
        level: 'Mostly Open',
        dimensions: {
          'Software Licensing': { score: 'green', note: 'MIT with source' },
          'Data Licensing': { score: 'green', note: 'Now open data' },
          'Technical Accessibility': { score: 'green', note: 'Full access' },
          'Data Standards': { score: 'green', note: 'Standards compliant' },
          'Infrastructure': { score: 'yellow', note: 'Self-hosting available' },
          'Community Governance': { score: 'yellow', note: 'Community input' }
        }
      }
    };
    
    const updated = await toolsDb.updateTool(toolId, updates);
    console.log(`✅ Updated: ${updated.name}`);
    console.log(`   New score: ${updated.openness.score}/6`);
    console.log(`   Features: ${updated.features.length} items`);

    // 4. Test READ ALL
    console.log('\n📋 Testing READ ALL...');
    const allTools = await toolsDb.getTools();
    console.log(`✅ Found ${allTools.length} total tools`);
    const testTools = allTools.filter(t => t.organization === 'Test Organization');
    console.log(`   Test tools: ${testTools.length}`);

    // 5. Test DELETE
    console.log('\n4️⃣ Testing DELETE...');
    await toolsDb.deleteTool(toolId);
    console.log(`✅ Deleted tool: ${toolId}`);
    
    // Verify deletion
    const deleted = await toolsDb.getTool(toolId);
    if (deleted === null) {
      console.log('✅ Deletion verified (tool not found)');
    } else {
      throw new Error('Tool still exists after deletion');
    }

    console.log('\n🎉 All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('\n❌ CRUD test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testCRUD().then(() => {
  console.log('\n✅ CRUD functionality test passed');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Test execution failed:', error);
  process.exit(1);
});
