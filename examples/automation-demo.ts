import { ToolImporter } from '../utils/tool-importer';
import { ToolValidator } from '../utils/validator';
import { OpennessAssessor } from '../utils/openness-assessor';
import type { RawToolData } from '../schemas/tool.schema';

/**
 * Example demonstrating how to use the tool automation infrastructure
 * to convert raw tool data into the Open Earth Tools format
 */

// Example raw tool data (this could come from JSON files, APIs, etc.)
const exampleRawTools: RawToolData[] = [
  {
    name: "Example Climate Tracker",
    url: "https://example.org/climate-tracker",
    audience: ["researchers", "policy makers"],
    data_type: ["climate", "temperature"],
    functionality: ["visualization", "analysis", "time series"],
    notes: "A comprehensive climate tracking tool that provides real-time temperature and precipitation data with historical comparisons.",
    standout_features: ["Real-time data", "Historical comparison", "Global coverage"],
    organization: "Example Research Institute",
    license: "MIT",
    category: "Climate"
  },
  {
    name: "Ocean Temperature Monitor",
    url: "https://noaa.gov/ocean-temp",
    audience: ["marine scientists", "educators"],
    data_type: ["ocean", "temperature"],
    functionality: ["monitoring", "alerts", "download"],
    notes: "NOAA's ocean temperature monitoring system with real-time buoy data and satellite observations.",
  }
];

async function demonstrateAutomation() {
  console.log('🚀 Demonstrating Tool Automation Infrastructure');
  console.log('================================================');

  // Step 1: Create instances of our automation tools
  const importer = new ToolImporter();
  const validator = new ToolValidator();
  const assessor = new OpennessAssessor();

  try {
    // Step 2: Convert raw tools to full Tool objects
    console.log('\\n📝 Converting raw tool data...');
    const convertedTools = await importer.importFromJSON(exampleRawTools);
    console.log(`✅ Successfully converted ${convertedTools.length} tools`);

    // Step 3: Validate the converted tools
    console.log('\\n🔍 Validating converted tools...');
    for (const tool of convertedTools) {
      const validation = validator.validateTool(tool);
      
      if (validation.isValid) {
        console.log(`✅ ${tool.name}: Valid`);
        if (validation.warnings) {
          validation.warnings.forEach(warning => 
            console.log(`   ⚠️  Warning: ${warning}`)
          );
        }
      } else {
        console.log(`❌ ${tool.name}: Invalid`);
        validation.errors.forEach(error => 
          console.log(`   🔴 Error: ${error}`)
        );
      }
    }

    // Step 4: Show the automated assessment results
    console.log('\\n📊 Automated Assessment Results:');
    console.log('==================================');
    
    for (const tool of convertedTools) {
      console.log(`\\n🔧 ${tool.name}`);
      console.log(`   ID: ${tool.id}`);
      console.log(`   Organization: ${tool.organization}`);
      console.log(`   Category: ${tool.category} ${tool.icon}`);
      console.log(`   License: ${tool.license}`);
      console.log(`   Embed Supported: ${tool.embedSupported ? '✅' : '❌'}`);
      console.log(`   Openness: ${tool.openness.level} (${tool.openness.score}/6)`);
      console.log(`   Features: ${tool.features.join(', ')}`);
      
      // Show openness dimension breakdown
      console.log('   Openness Dimensions:');
      Object.entries(tool.openness.dimensions).forEach(([dimension, score]) => {
        const emoji = score.score === 'green' ? '🟢' : score.score === 'yellow' ? '🟡' : '🔴';
        console.log(`     ${emoji} ${dimension}: ${score.note}`);
      });
    }

    // Step 5: Generate TypeScript output
    console.log('\\n📄 Generated TypeScript:');
    console.log('========================');
    const tsOutput = generateToolsTypeScript(convertedTools);
    console.log(tsOutput.substring(0, 800) + '...');

    console.log('\\n🎉 Automation demonstration complete!');
    console.log('\\nKey Benefits:');
    console.log('• Reduced manual work from 2-3 hours to 10-15 minutes');
    console.log('• Consistent formatting and validation');
    console.log('• Automated openness assessment');
    console.log('• Standardized category and feature mapping');

  } catch (error) {
    console.error('❌ Error during automation:', error);
  }
}

function generateToolsTypeScript(tools: any[]): string {
  const toolsJson = JSON.stringify(tools, null, 2);
  return `import { Tool } from '../lib/types';

export const tools: Tool[] = ${toolsJson};
`;
}

// Demonstrate individual components
async function demonstrateComponents() {
  console.log('\\n🔧 Component Demonstrations:');
  console.log('=============================');

  // Demonstrate Openness Assessor standalone
  console.log('\\n1. Openness Assessor:');
  const assessor = new OpennessAssessor();
  const sampleTool = exampleRawTools[0];
  const assessment = assessor.assess(sampleTool);
  
  console.log(`   Tool: ${sampleTool.name}`);
  console.log(`   Assessed Level: ${assessment.level} (${assessment.score}/6)`);

  // Demonstrate Validator standalone
  console.log('\\n2. Validator:');
  const validator = new ToolValidator();
  // Note: This would need a complete Tool object to validate
  console.log('   Ready to validate complete Tool objects');

  // Show configuration mappings
  console.log('\\n3. Configuration Mappings:');
  console.log('   Categories available:', Object.keys(require('../config/tool-mappings').CATEGORY_MAPPING).length);
  console.log('   Organization patterns:', require('../config/tool-mappings').ORGANIZATION_PATTERNS.length);
  console.log('   Embedding rules:', require('../config/tool-mappings').EMBEDDING_RULES.length);
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrateAutomation()
    .then(() => demonstrateComponents())
    .catch(console.error);
}

export { demonstrateAutomation, demonstrateComponents };
