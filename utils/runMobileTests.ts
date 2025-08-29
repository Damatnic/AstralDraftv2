/**
 * Mobile Testing Runner
 * Execute comprehensive mobile testing and generate report
 */

import { mobileTestingSuite } from './mobileTestingSuite';

export async function runComprehensiveMobileTests() {
  // Starting comprehensive mobile testing suite
  
  try {
    // Run full mobile test suite
    const results = await mobileTestingSuite.runFullMobileSuite();
    
    // Generate detailed report
    const report = mobileTestingSuite.generateMobileReport(results);
    
    // Log summary to console
    // Mobile Testing Summary:
    // Passed: ${results.summary.passed}/${results.summary.totalTests}
    // Failed: ${results.summary.failed}/${results.summary.totalTests}
    // Critical Issues: ${results.summary.criticalIssues}
    
    // Identify critical issues that need immediate attention
    const criticalIssues = [
      ...results.touchTargets.filter(t => !t.passed),
      ...results.accessibility.filter(a => !a.passed),
      ...results.usability.filter(u => !u.passed && u.testType === 'usability')
    ];
    
    if (results.summary.criticalIssues > 0) {
      // Critical issues detected - see full report for details
    }
    
    // Return results for further processing
    return {
      results,
      report,
      criticalIssues,
      needsImmediateAttention: criticalIssues.length > 0
    };
    
  } catch (error) {
    // Mobile testing failed
    throw error;
  }
}

// Auto-run if called directly
if (require.main === module) {
  runComprehensiveMobileTests()
    .then(({ needsImmediateAttention }: { needsImmediateAttention: boolean }) => {
      // Full Report generated
      
      if (needsImmediateAttention) {
        // Mobile optimization required before production deployment!
      } else {
        // Mobile responsiveness looks good! Ready for production.
      }
    })
        .catch((error: Error) => {
      // Error running mobile tests
      throw error;
    });
}
