import { toolsDb } from '../lib/database'
import { Tool } from '../lib/types'

async function testCRUD() {
  console.log('🧪 Starting CRUD functionality tests...\n')

  try {
    // Test CREATE
    console.log('1️⃣ Testing CREATE...')
    const testTool: Omit<Tool, 'id'> = {
      name: 'Test Earth Tool',
      url: 'https://example.com/test-tool',
      description: 'A test tool for Earth science visualization testing.',
      organization: 'Test Organization',
      license: 'MIT',
      category: 'Data Visualization',
      embedUrl: 'https://example.com/test-tool/embed',
      features: ['Real-time data', 'Interactive maps', 'Data export'],
      icon: '🧪',
      status: 'Testing',
      embedSupported: true,
      embedNote: 'Embedding supported via iframe',
      openness: {
        score: 4.5,
        level: 'Mostly Open',
        dimensions: {
          'Software Licensing': { score: 'green', note: 'MIT license available' },
          'Data Licensing': { score: 'green', note: 'Open data sources' },
          'Technical Accessibility': { score: 'yellow', note: 'Some embedding restrictions' },
          'Data Standards': { score: 'green', note: 'Uses GeoJSON and standard formats' },
          'Infrastructure': { score: 'yellow', note: 'Can self-host with setup' },
          'Community Governance': { score: 'yellow', note: 'Organization-led with contributions' }
        }
      }
    }

    const createdTool = await toolsDb.createTool(testTool)
    console.log(`✅ Created tool with ID: ${createdTool.id}`)
    console.log(`   Name: ${createdTool.name}`)
    console.log(`   Organization: ${createdTool.organization}`)
    console.log(`   Category: ${createdTool.category}`)
    console.log(`   Openness Score: ${createdTool.openness.score}/6`)

    // Test READ
    console.log('\n2️⃣ Testing READ...')
    const retrievedTool = await toolsDb.getTool(createdTool.id)
    if (retrievedTool) {
      console.log(`✅ Retrieved tool: ${retrievedTool.name}`)
      console.log(`   Description: ${retrievedTool.description}`)
      console.log(`   Features: ${retrievedTool.features.join(', ')}`)
      console.log(`   Embed Supported: ${retrievedTool.embedSupported}`)
    } else {
      throw new Error('Failed to retrieve created tool')
    }

    // Test READ ALL
    console.log('\n📋 Testing READ ALL...')
    const allTools = await toolsDb.getTools()
    console.log(`✅ Retrieved ${allTools.length} tools total`)
    const testTools = allTools.filter(t => t.organization === 'Test Organization')
    console.log(`   Found ${testTools.length} test tools`)

    // Test UPDATE
    console.log('\n3️⃣ Testing UPDATE...')
    const updateData = {
      description: 'An updated test tool for Earth science visualization testing with enhanced features.',
      features: ['Real-time data', 'Interactive maps', 'Data export', 'Advanced analytics'],
      openness: {
        score: 5,
        level: 'Mostly Open' as const,
        dimensions: {
          'Software Licensing': { score: 'green' as const, note: 'MIT license with full source code' },
          'Data Licensing': { score: 'green' as const, note: 'All open data sources verified' },
          'Technical Accessibility': { score: 'green' as const, note: 'Full embedding support added' },
          'Data Standards': { score: 'green' as const, note: 'Enhanced standard format support' },
          'Infrastructure': { score: 'yellow' as const, note: 'Self-hosting documentation improved' },
          'Community Governance': { score: 'yellow' as const, note: 'Active community contributions' }
        }
      }
    }

    const updatedTool = await toolsDb.updateTool(createdTool.id, updateData)
    console.log(`✅ Updated tool: ${updatedTool.name}`)
    console.log(`   New description: ${updatedTool.description}`)
    console.log(`   Features count: ${updatedTool.features.length}`)
    console.log(`   New openness score: ${updatedTool.openness.score}/6`)
    console.log(`   Technical Accessibility: ${updatedTool.openness.dimensions['Technical Accessibility'].score}`)

    // Test partial UPDATE
    console.log('\n🔄 Testing PARTIAL UPDATE...')
    const partialUpdate = {
      icon: '🌍',
      status: 'Production'
    }
    
    const partiallyUpdatedTool = await toolsDb.updateTool(createdTool.id, partialUpdate)
    console.log(`✅ Partially updated tool: ${partiallyUpdatedTool.name}`)
    console.log(`   New icon: ${partiallyUpdatedTool.icon}`)
    console.log(`   New status: ${partiallyUpdatedTool.status}`)
    // Verify other fields weren't affected
    console.log(`   Description unchanged: ${partiallyUpdatedTool.description === updateData.description}`)

    // Test READ by category
    console.log('\n🏷️ Testing READ BY CATEGORY...')
    const categoryTools = await toolsDb.getToolsByCategory('Data Visualization')
    console.log(`✅ Found ${categoryTools.length} tools in 'Data Visualization' category`)
    const ourTestTool = categoryTools.find(t => t.id === createdTool.id)
    console.log(`   Our test tool found in category: ${!!ourTestTool}`)

    // Test DELETE
    console.log('\n4️⃣ Testing DELETE...')
    await toolsDb.deleteTool(createdTool.id)
    console.log(`✅ Deleted tool with ID: ${createdTool.id}`)

    // Verify deletion
    console.log('\n🔍 Verifying deletion...')
    const deletedTool = await toolsDb.getTool(createdTool.id)
    if (deletedTool === null) {
      console.log('✅ Tool successfully deleted (not found)')
    } else {
      throw new Error('Tool still exists after deletion')
    }

    // Test stats
    console.log('\n📊 Testing STATS...')
    const stats = await toolsDb.getStats()
    console.log(`✅ Database stats:`)
    console.log(`   Total tools: ${stats.totalTools}`)
    console.log(`   Total categories: ${stats.totalCategories}`)
    console.log(`   Total organizations: ${stats.totalOrganizations}`)

    console.log('\n🎉 All CRUD tests passed successfully!')
    
  } catch (error) {
    console.error('\n❌ CRUD test failed:', error)
    
    // Cleanup: try to delete the test tool if it exists
    try {
      const testTools = await toolsDb.getTools()
      const testTool = testTools.find(t => t.name === 'Test Earth Tool')
      if (testTool) {
        await toolsDb.deleteTool(testTool.id)
        console.log('🧹 Cleaned up test tool')
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup test tool:', cleanupError)
    }
    
    throw error
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testCRUD()
    .then(() => {
      console.log('\n✅ CRUD functionality test completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ CRUD functionality test failed:', error)
      process.exit(1)
    })
}

export { testCRUD }
