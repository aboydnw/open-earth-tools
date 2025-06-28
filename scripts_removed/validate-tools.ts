#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import { ToolValidator } from '../utils/validator';
import { tools as existingTools } from '../data/tools';
import type { Tool } from '../schemas/tool.schema';

const program = new Command();

program
  .name('validate-tools')
  .description('Validate tools data for consistency and completeness')
  .version('1.0.0');

program
  .option('-f, --file <path>', 'Validate tools from specific file')
  .option('--existing', 'Validate existing tools in data/tools.ts', true)
  .option('--strict', 'Enable strict validation with additional checks')
  .option('--summary', 'Show detailed summary of validation results')
  .action(async (options) => {
    try {
      await validateTools(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

async function validateTools(options: any) {
  let toolsToValidate: Tool[] = [];
  
  if (options.file) {
    console.log(chalk.blue(`🔍 Reading tools from ${options.file}...`));
    const fileContent = readFileSync(options.file, 'utf-8');
    
    // Try to parse as JSON first, then as TypeScript module
    try {
      toolsToValidate = JSON.parse(fileContent);
    } catch {
      // If JSON parsing fails, try to extract from TypeScript
      const match = fileContent.match(/export const tools: Tool\[\] = (\[[\s\S]*?\]);/);
      if (match) {
        toolsToValidate = JSON.parse(match[1]);
      } else {
        throw new Error('Could not parse tools from file');
      }
    }
  } else {
    console.log(chalk.blue('🔍 Validating existing tools...'));
    toolsToValidate = existingTools;
  }

  console.log(chalk.green(`✅ Found ${toolsToValidate.length} tools to validate`));

  const validator = new ToolValidator();
  
  // Individual tool validation
  console.log(chalk.blue('🔍 Running individual tool validation...'));
  const individualResults: Array<{ tool: Tool; result: any }> = [];
  let passedTools = 0;
  let failedTools = 0;
  
  toolsToValidate.forEach((tool, index) => {
    const result = validator.validateTool(tool);
    individualResults.push({ tool, result });
    
    if (result.isValid) {
      passedTools++;
      if (result.warnings && result.warnings.length > 0) {
        console.warn(chalk.yellow(`⚠️  Tool "${tool.name}" has warnings:`));
        result.warnings.forEach((warning: string) => console.warn(chalk.yellow(`     ${warning}`)));
      }
    } else {
      failedTools++;
      console.error(chalk.red(`❌ Tool "${tool.name}" failed validation:`));
      result.errors.forEach((error: string) => console.error(chalk.red(`     ${error}`)));
    }
  });

  // Batch validation for cross-tool issues
  console.log(chalk.blue('\n🔍 Running batch validation...'));
  const batchResult = validator.validateMultipleTools(toolsToValidate);
  
  // Summary
  console.log(chalk.blue('\n📊 Validation Summary:'));
  
  if (passedTools === toolsToValidate.length && batchResult.isValid) {
    console.log(chalk.green(`✅ All ${toolsToValidate.length} tools passed validation!`));
  } else {
    console.log(chalk.red(`❌ ${failedTools} of ${toolsToValidate.length} tools failed validation`));
    console.log(chalk.green(`✅ ${passedTools} tools passed validation`));
  }

  if (batchResult.warnings && batchResult.warnings.length > 0) {
    console.log(chalk.yellow(`⚠️  ${batchResult.warnings.length} batch warnings found`));
  }

  if (options.summary || options.strict) {
    showDetailedSummary(toolsToValidate, individualResults);
  }

  if (options.strict) {
    runStrictValidation(toolsToValidate);
  }

  // Exit with error code if validation failed
  if (failedTools > 0 || !batchResult.isValid) {
    process.exit(1);
  }
}

function showDetailedSummary(tools: Tool[], results: Array<{ tool: Tool; result: any }>) {
  console.log(chalk.blue('\n📋 Detailed Summary:'));
  
  // Category distribution
  const categoryCount: Record<string, number> = {};
  const organizationCount: Record<string, number> = {};
  const licenseCount: Record<string, number> = {};
  const opennessCount: Record<string, number> = {};
  
  let embedSupportedCount = 0;
  let toolsWithWarnings = 0;
  let totalFeatures = 0;
  
  tools.forEach((tool, index) => {
    categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
    organizationCount[tool.organization] = (organizationCount[tool.organization] || 0) + 1;
    licenseCount[tool.license] = (licenseCount[tool.license] || 0) + 1;
    opennessCount[tool.openness.level] = (opennessCount[tool.openness.level] || 0) + 1;
    
    if (tool.embedSupported) embedSupportedCount++;
    totalFeatures += tool.features.length;
    
    if (results[index].result.warnings && results[index].result.warnings.length > 0) {
      toolsWithWarnings++;
    }
  });

  console.log(chalk.cyan(`📊 Tools by Category:`));
  Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(chalk.white(`   ${category}: ${count}`));
    });

  console.log(chalk.cyan(`\n🏢 Tools by Organization:`));
  Object.entries(organizationCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10) // Top 10
    .forEach(([org, count]) => {
      console.log(chalk.white(`   ${org}: ${count}`));
    });

  console.log(chalk.cyan(`\n📄 License Distribution:`));
  Object.entries(licenseCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([license, count]) => {
      console.log(chalk.white(`   ${license}: ${count}`));
    });

  console.log(chalk.cyan(`\n🔓 Openness Distribution:`));
  Object.entries(opennessCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([level, count]) => {
      const color = level.includes('Fully') ? 'green' : 
                   level.includes('Mostly') ? 'yellow' : 'red';
      console.log(chalk[color](`   ${level}: ${count}`));
    });

  console.log(chalk.cyan(`\n📈 Additional Stats:`));
  console.log(chalk.white(`   Embed Supported: ${embedSupportedCount}/${tools.length} (${Math.round(embedSupportedCount/tools.length*100)}%)`));
  console.log(chalk.white(`   Tools with Warnings: ${toolsWithWarnings}`));
  console.log(chalk.white(`   Average Features per Tool: ${Math.round(totalFeatures/tools.length*10)/10}`));
}

function runStrictValidation(tools: Tool[]) {
  console.log(chalk.blue('\n🔍 Running strict validation checks...'));
  
  const issues: string[] = [];
  
  // Check for inconsistent naming patterns
  const idPatterns = tools.map(t => t.id);
  const hasInconsistentIds = idPatterns.some(id => {
    return !/^[a-z0-9-]+$/.test(id) || id.includes('--') || id.startsWith('-') || id.endsWith('-');
  });
  
  if (hasInconsistentIds) {
    issues.push('Some tool IDs do not follow naming convention');
  }

  // Check for URL accessibility patterns
  const suspiciousUrls = tools.filter(tool => {
    return !tool.url.startsWith('https://') || 
           tool.url.includes('localhost') || 
           tool.url.includes('127.0.0.1');
  });
  
  if (suspiciousUrls.length > 0) {
    issues.push(`${suspiciousUrls.length} tools have suspicious URLs (non-HTTPS or localhost)`);
  }

  // Check for description quality
  const shortDescriptions = tools.filter(tool => tool.description.length < 50);
  if (shortDescriptions.length > 0) {
    issues.push(`${shortDescriptions.length} tools have very short descriptions`);
  }

  // Check for feature diversity
  const allFeatures = tools.flatMap(tool => tool.features);
  const uniqueFeatures = new Set(allFeatures);
  const repetitiveFeatures = tools.filter(tool => {
    const commonFeatures = ['Data visualization', 'Interactive exploration', 'Web-based access'];
    return tool.features.every(feature => commonFeatures.includes(feature));
  });
  
  if (repetitiveFeatures.length > tools.length * 0.3) {
    issues.push('Many tools have generic/repetitive features');
  }

  // Check openness score consistency
  const opennessIssues = tools.filter(tool => {
    const dimensions = Object.values(tool.openness.dimensions);
    let calculatedScore = 0;
    dimensions.forEach(dim => {
      calculatedScore += dim.score === 'green' ? 1 : dim.score === 'yellow' ? 0.5 : 0;
    });
    return Math.round(calculatedScore) !== tool.openness.score;
  });
  
  if (opennessIssues.length > 0) {
    issues.push(`${opennessIssues.length} tools have openness score inconsistencies`);
  }

  // Report strict validation results
  if (issues.length === 0) {
    console.log(chalk.green('✅ Passed all strict validation checks!'));
  } else {
    console.log(chalk.yellow('⚠️  Strict validation found potential issues:'));
    issues.forEach(issue => console.log(chalk.yellow(`   • ${issue}`)));
  }
}

program.parse();
