#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { ToolImporter } from '../utils/tool-importer';
import { ToolValidator } from '../utils/validator';
import { RawToolSchema, ImportConfigSchema } from '../schemas/tool.schema';
import type { RawToolData, Tool } from '../schemas/tool.schema';

const program = new Command();

program
  .name('import-tools')
  .description('Import tools from JSON file to TypeScript format')
  .version('1.0.0');

program
  .option('-f, --file <path>', 'JSON file path containing raw tool data')
  .option('-o, --output <path>', 'Output file path (default: update data/tools.ts)')
  .option('--validate-only', 'Only validate without importing')
  .option('--dry-run', 'Show what would be imported without writing files')
  .option('--skip-duplicates', 'Skip duplicate tools instead of failing', true)
  .option('--overwrite-existing', 'Overwrite existing tools with same ID', false)
  .action(async (options) => {
    try {
      await importTools(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

async function importTools(options: any) {
  // Validate options
  if (!options.file) {
    throw new Error('File path is required. Use -f or --file option.');
  }

  if (!existsSync(options.file)) {
    throw new Error(`File not found: ${options.file}`);
  }

  console.log(chalk.blue('🔍 Reading input file...'));
  
  // Read and parse JSON file
  const rawData = JSON.parse(readFileSync(options.file, 'utf-8'));
  
  if (!Array.isArray(rawData)) {
    throw new Error('Input file must contain an array of tool objects');
  }

  console.log(chalk.green(`✅ Found ${rawData.length} tools in input file`));

  // Validate raw data schema
  console.log(chalk.blue('🔍 Validating input data schema...'));
  const validatedData: RawToolData[] = [];
  const schemaErrors: string[] = [];

  for (let i = 0; i < rawData.length; i++) {
    try {
      const validatedTool = RawToolSchema.parse(rawData[i]);
      validatedData.push(validatedTool);
    } catch (error: any) {
      if (error.errors) {
        schemaErrors.push(`Tool ${i + 1}: ${error.errors.map((e: any) => e.message).join(', ')}`);
      } else {
        schemaErrors.push(`Tool ${i + 1}: ${error.message}`);
      }
    }
  }

  if (schemaErrors.length > 0) {
    console.error(chalk.red('❌ Schema validation errors:'));
    schemaErrors.forEach(error => console.error(chalk.red(`   ${error}`)));
    throw new Error(`${schemaErrors.length} tools failed schema validation`);
  }

  console.log(chalk.green('✅ All tools passed schema validation'));

  // Import tools
  console.log(chalk.blue('🔄 Converting tools...'));
  const importer = new ToolImporter();
  const config = ImportConfigSchema.parse(options);
  
  const convertedTools = await importer.importWithProgress(
    validatedData,
    config,
    (current, total, toolName) => {
      process.stdout.write(`\\r${chalk.blue('🔄')} Processing: ${current}/${total} - ${toolName.substring(0, 50)}...`);
    }
  );

  console.log(); // New line after progress
  console.log(chalk.green(`✅ Successfully converted ${convertedTools.length} tools`));

  // Validate converted tools
  if (!options.validateOnly) {
    console.log(chalk.blue('🔍 Validating converted tools...'));
    const validator = new ToolValidator();
    const validationResult = validator.validateMultipleTools(convertedTools);
    
    if (!validationResult.isValid) {
      console.error(chalk.red('❌ Validation errors:'));
      validationResult.errors.forEach(error => console.error(chalk.red(`   ${error}`)));
      throw new Error('Tool validation failed');
    }

    if (validationResult.warnings) {
      console.warn(chalk.yellow('⚠️  Validation warnings:'));
      validationResult.warnings.forEach(warning => console.warn(chalk.yellow(`   ${warning}`)));
    }

    console.log(chalk.green('✅ All tools passed validation'));
  }

  // Generate TypeScript output
  const outputContent = generateToolsTypeScript(convertedTools);

  if (options.dryRun) {
    console.log(chalk.blue('📄 Generated TypeScript (dry run):'));
    console.log(outputContent);
    return;
  }

  if (options.validateOnly) {
    console.log(chalk.green('✅ Validation complete - no files written'));
    return;
  }

  // Write to file
  const outputPath = options.output || join(process.cwd(), 'data', 'tools.ts');
  
  if (existsSync(outputPath) && !options.overwriteExisting) {
    console.log(chalk.yellow('⚠️  Output file exists. Use --overwrite-existing to replace it.'));
    console.log(chalk.blue('📄 Generated content would be:'));
    console.log(outputContent.substring(0, 500) + '...');
    return;
  }

  writeFileSync(outputPath, outputContent);
  console.log(chalk.green(`✅ Successfully wrote ${convertedTools.length} tools to ${outputPath}`));

  // Show summary
  showImportSummary(convertedTools);
}

function generateToolsTypeScript(tools: Tool[]): string {
  const toolsJson = JSON.stringify(tools, null, 2);
  
  return `import { Tool } from '../lib/types';

export const tools: Tool[] = ${toolsJson};
`;
}

function showImportSummary(tools: Tool[]) {
  console.log(chalk.blue('\\n📊 Import Summary:'));
  
  // Count by category
  const categoryCount: Record<string, number> = {};
  const opennessCount: Record<string, number> = {};
  let embedSupported = 0;

  tools.forEach(tool => {
    categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
    opennessCount[tool.openness.level] = (opennessCount[tool.openness.level] || 0) + 1;
    if (tool.embedSupported) embedSupported++;
  });

  console.log(chalk.green(`📦 Total tools: ${tools.length}`));
  console.log(chalk.green(`🔗 Embeddable tools: ${embedSupported}/${tools.length}`));
  
  console.log(chalk.blue('\\n📂 By Category:'));
  Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(chalk.cyan(`   ${category}: ${count}`));
    });

  console.log(chalk.blue('\\n🔓 By Openness Level:'));
  Object.entries(opennessCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([level, count]) => {
      const color = level.includes('Fully') ? 'green' : 
                   level.includes('Mostly') ? 'yellow' : 'red';
      console.log(chalk[color](`   ${level}: ${count}`));
    });
}

program.parse();
