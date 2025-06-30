/**
 * Live Embedding Assessment Tool
 * 
 * This script actually tests iframe embedding for each tool to determine
 * real embedding capabilities rather than making domain-based guesses.
 */

import { toolsDb } from '../lib/database';
import { Tool } from '../lib/types';
import puppeteer from 'puppeteer';

interface EmbedTestResult {
  toolId: string;
  toolName: string;
  url: string;
  canEmbed: boolean;
  errorType?: 'CSP' | 'X_FRAME_OPTIONS' | 'NETWORK_ERROR' | 'TIMEOUT' | 'MIXED_CONTENT' | 'UNKNOWN';
  errorMessage?: string;
  loadTime?: number;
  httpStatus?: number;
}

interface UpdateResult extends EmbedTestResult {
  oldEmbedSupported: boolean;
  newEmbedSupported: boolean;
  oldEmbedNote: string;
  newEmbedNote: string;
  changed: boolean;
}

const TIMEOUT_MS = 10000; // 10 seconds timeout per test
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function testEmbedding(url: string, toolName: string): Promise<EmbedTestResult> {
  console.log(`  🧪 Testing embedding for: ${toolName}`);
  console.log(`     URL: ${url}`);
  
  let browser;
  const startTime = Date.now();
  
  try {
    // Launch browser in headless mode
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    
    // Create a simple HTML page with an iframe
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Embed Test</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          iframe { width: 800px; height: 600px; border: 1px solid #ddd; }
          .status { margin: 10px 0; padding: 10px; border-radius: 4px; }
          .loading { background: #f0f8ff; border: 1px solid #87ceeb; }
          .success { background: #f0fff0; border: 1px solid #90ee90; }
          .error { background: #fff0f0; border: 1px solid #ffb6c1; }
        </style>
      </head>
      <body>
        <h2>Embedding Test for: ${toolName}</h2>
        <div id="status" class="status loading">Loading iframe...</div>
        <iframe 
          id="testFrame" 
          src="${url}"
          sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          onload="window.embedSuccess = true; document.getElementById('status').innerHTML = 'Iframe loaded successfully!'; document.getElementById('status').className = 'status success';"
          onerror="window.embedError = true; document.getElementById('status').innerHTML = 'Iframe failed to load'; document.getElementById('status').className = 'status error';"
        ></iframe>
        
        <script>
          // Additional error detection
          window.embedSuccess = false;
          window.embedError = false;
          window.cspError = false;
          window.frameError = false;
          
          // Listen for CSP violations
          document.addEventListener('securitypolicyviolation', function(e) {
            console.log('CSP Violation:', e.violatedDirective);
            window.cspError = true;
            window.cspViolation = e.violatedDirective;
          });
          
          // Check for X-Frame-Options errors
          window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('frame')) {
              window.frameError = true;
              window.frameErrorMessage = e.message;
            }
          });
          
          // Timeout check
          setTimeout(function() {
            if (!window.embedSuccess && !window.embedError) {
              window.embedTimeout = true;
              document.getElementById('status').innerHTML = 'Iframe load timeout';
              document.getElementById('status').className = 'status error';
            }
          }, 8000);
        </script>
      </body>
      </html>
    `;
    
    // Set the HTML content
    await page.setContent(testHTML);
    
    // Set up console message monitoring
    let consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Set up network response monitoring
    let httpStatus: number | undefined;
    page.on('response', response => {
      if (response.url() === url) {
        httpStatus = response.status();
      }
    });
    
    // Wait for the test to complete (either success, error, or timeout)
    await page.waitForFunction(
      () => (window as any).embedSuccess || (window as any).embedError || (window as any).embedTimeout || (window as any).cspError || (window as any).frameError,
      { timeout: TIMEOUT_MS }
    );
    
    // Get the results
    const results = await page.evaluate(() => ({
      embedSuccess: (window as any).embedSuccess,
      embedError: (window as any).embedError,
      embedTimeout: (window as any).embedTimeout,
      cspError: (window as any).cspError,
      cspViolation: (window as any).cspViolation,
      frameError: (window as any).frameError,
      frameErrorMessage: (window as any).frameErrorMessage
    }));
    
    const loadTime = Date.now() - startTime;
    
    // Determine the result
    const result: EmbedTestResult = {
      toolId: '', // Will be set by caller
      toolName,
      url,
      canEmbed: results.embedSuccess,
      loadTime,
      httpStatus
    };
    
    // Determine error type and message
    if (!results.embedSuccess) {
      if (results.cspError) {
        result.errorType = 'CSP';
        result.errorMessage = `Content Security Policy violation: ${results.cspViolation}`;
      } else if (results.frameError) {
        result.errorType = 'X_FRAME_OPTIONS';
        result.errorMessage = results.frameErrorMessage || 'X-Frame-Options prevents embedding';
      } else if (results.embedTimeout) {
        result.errorType = 'TIMEOUT';
        result.errorMessage = 'Iframe failed to load within timeout period';
      } else if (httpStatus && httpStatus >= 400) {
        result.errorType = 'NETWORK_ERROR';
        result.errorMessage = `HTTP ${httpStatus} error when loading content`;
      } else if (consoleErrors.length > 0) {
        result.errorType = 'UNKNOWN';
        result.errorMessage = `Console errors: ${consoleErrors.join(', ')}`;
      } else {
        result.errorType = 'UNKNOWN';
        result.errorMessage = 'Iframe failed to load for unknown reasons';
      }
    }
    
    console.log(`     ✅ Test completed: ${result.canEmbed ? 'EMBEDDABLE' : 'NOT EMBEDDABLE'}`);
    if (!result.canEmbed) {
      console.log(`     ❌ Error: ${result.errorType} - ${result.errorMessage}`);
    }
    console.log(`     ⏱️  Load time: ${loadTime}ms`);
    
    return result;
    
  } catch (error) {
    const loadTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`     ❌ Test failed: ${errorMessage}`);
    
    return {
      toolId: '',
      toolName,
      url,
      canEmbed: false,
      errorType: 'UNKNOWN',
      errorMessage: `Test execution failed: ${errorMessage}`,
      loadTime
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateEmbedNote(testResult: EmbedTestResult): string {
  if (testResult.canEmbed) {
    return `Verified embeddable - iframe loads successfully (${testResult.loadTime}ms)`;
  }
  
  switch (testResult.errorType) {
    case 'CSP':
      return `Content Security Policy blocks iframe embedding - ${testResult.errorMessage}`;
    case 'X_FRAME_OPTIONS':
      return `X-Frame-Options header prevents embedding - ${testResult.errorMessage}`;
    case 'NETWORK_ERROR':
      return `Network error prevents embedding - HTTP ${testResult.httpStatus}`;
    case 'TIMEOUT':
      return `Embedding test timed out - site may be slow or blocking iframes`;
    case 'MIXED_CONTENT':
      return `Mixed content security prevents embedding`;
    default:
      return `Cannot embed - ${testResult.errorMessage || 'iframe fails to load'}`;
  }
}

async function liveEmbedAssessment(): Promise<void> {
  console.log('🧪 Starting LIVE embedding assessment...');
  console.log('This will actually test iframe embedding for each tool.\n');
  
  try {
    // Get all existing tools
    console.log('📥 Fetching all tools from database...');
    const tools = await toolsDb.getTools();
    console.log(`Found ${tools.length} tools to test\n`);
    
    const results: UpdateResult[] = [];
    let changedCount = 0;
    let testCount = 0;
    
    for (const tool of tools) {
      testCount++;
      console.log(`🔍 [${testCount}/${tools.length}] Testing: ${tool.name}`);
      
      // Test the actual embedding
      const testResult = await testEmbedding(tool.url, tool.name);
      testResult.toolId = tool.id;
      
      const newEmbedNote = generateEmbedNote(testResult);
      
      const result: UpdateResult = {
        ...testResult,
        oldEmbedSupported: tool.embedSupported,
        newEmbedSupported: testResult.canEmbed,
        oldEmbedNote: tool.embedNote || '',
        newEmbedNote,
        changed: tool.embedSupported !== testResult.canEmbed || (tool.embedNote || '') !== newEmbedNote
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
            embedSupported: testResult.canEmbed,
            embedNote: newEmbedNote
          });
          console.log(`  ✅ Updated successfully`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`  ❌ Failed to update: ${errorMessage}`);
        }
      } else {
        console.log(`  ✓ No changes needed (${testResult.canEmbed ? 'embeddable' : 'not embeddable'})`);
      }
      
      console.log('');
      
      // Small delay between tests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Print comprehensive summary
    console.log('='.repeat(70));
    console.log('🧪 LIVE EMBEDDING ASSESSMENT SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total tools tested: ${tools.length}`);
    console.log(`Tools updated: ${changedCount}`);
    console.log(`Tools unchanged: ${tools.length - changedCount}\n`);
    
    // Success/Failure breakdown
    const embeddableTools = results.filter(r => r.canEmbed);
    const nonEmbeddableTools = results.filter(r => !r.canEmbed);
    
    console.log(`✅ EMBEDDABLE TOOLS: ${embeddableTools.length}`);
    embeddableTools.forEach(r => {
      console.log(`   • ${r.toolName} (${r.loadTime}ms)`);
    });
    
    console.log(`\n❌ NON-EMBEDDABLE TOOLS: ${nonEmbeddableTools.length}`);
    const errorsByType = nonEmbeddableTools.reduce((acc, r) => {
      const type = r.errorType || 'UNKNOWN';
      if (!acc[type]) acc[type] = [];
      acc[type].push(r);
      return acc;
    }, {} as Record<string, UpdateResult[]>);
    
    Object.entries(errorsByType).forEach(([errorType, tools]) => {
      console.log(`\n   ${errorType} (${tools.length} tools):`);
      tools.forEach(r => {
        console.log(`     • ${r.toolName}: ${r.errorMessage}`);
      });
    });
    
    if (changedCount > 0) {
      console.log(`\n🔧 CHANGES MADE:`);
      const changedResults = results.filter(r => r.changed);
      
      const newlyEmbeddable = changedResults.filter(r => !r.oldEmbedSupported && r.newEmbedSupported);
      const newlyNonEmbeddable = changedResults.filter(r => r.oldEmbedSupported && !r.newEmbedSupported);
      
      if (newlyEmbeddable.length > 0) {
        console.log(`\n✅ ${newlyEmbeddable.length} tools now confirmed as EMBEDDABLE:`);
        newlyEmbeddable.forEach(r => {
          console.log(`   • ${r.toolName} (${r.loadTime}ms load time)`);
        });
      }
      
      if (newlyNonEmbeddable.length > 0) {
        console.log(`\n❌ ${newlyNonEmbeddable.length} tools now confirmed as NON-EMBEDDABLE:`);
        newlyNonEmbeddable.forEach(r => {
          console.log(`   • ${r.toolName}: ${r.errorType} - ${r.errorMessage}`);
        });
      }
    }
    
    console.log('\n🎉 Live embedding assessment completed successfully!');
    console.log('\n💡 RESULTS:');
    console.log('• Each tool was actually tested with iframe embedding');
    console.log('• CSP violations, X-Frame-Options, and network errors were detected');
    console.log('• Embedding capabilities are now based on real-world testing');
    console.log('• Load times are recorded for performance insights');
    console.log('• Database reflects actual embedding compatibility');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error during live assessment:', errorMessage);
    throw error;
  }
}

// Export for external use
export { liveEmbedAssessment, testEmbedding };

// Run the assessment if this script is executed directly
if (require.main === module) {
  liveEmbedAssessment()
    .then(() => {
      console.log('\n✅ Live embedding assessment completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('\n❌ Live embedding assessment failed:', errorMessage);
      process.exit(1);
    });
}
