/**
 * Mobile Testing Runner
 * Execute comprehensive mobile testing and generate report
 */

import { mobileTestingSuite } from &apos;./mobileTestingSuite&apos;;

export async function runMobileTests() {
}
  console.log(&apos;🚀 Starting comprehensive mobile responsiveness testing...&apos;);
  
  try {
}
    // Run full mobile test suite
    const results = await mobileTestingSuite.runFullMobileSuite();
    
    // Generate detailed report
    const report = mobileTestingSuite.generateMobileReport(results);
    
    // Log summary to console
    console.log(&apos;\n📊 Mobile Testing Summary:&apos;);
    console.log(`✅ Passed: ${results.summary.passed}/${results.summary.totalTests}`);
    console.log(`❌ Failed: ${results.summary.failed}/${results.summary.totalTests}`);
    console.log(`🚨 Critical Issues: ${results.summary.criticalIssues}`);
    
    // Identify critical issues that need immediate attention
    const criticalIssues = [
      ...results.touchTargets.filter((t: any) => !t.passed),
      ...results.accessibility.filter((a: any) => !a.passed),
      ...results.usability.filter((u: any) => !u.passed && u.testType === &apos;usability&apos;)
    ];
    
    if (criticalIssues.length > 0) {
}
      console.log(&apos;\n🔥 Critical Issues Requiring Immediate Attention:&apos;);
      criticalIssues.forEach((issue, index) => {
}
        const name = &apos;element&apos; in issue ? issue.element : issue.component;
        console.log(`${index + 1}. ${name}`);
      });
    }
    
    // Return results for further processing
    return {
}
      results,
      report,
      criticalIssues,
      needsImmediateAttention: criticalIssues.length > 0
    };

    } catch (error) {
}
    console.error(&apos;❌ Mobile testing failed:&apos;, error);
    throw error;
  }
}

// Auto-run if called directly
if (require.main === module) {
}
  runMobileTests()
    .then(({ report, needsImmediateAttention }: any) => {
}
      console.log(&apos;\n📄 Full Report:&apos;);
      console.log(report);
      
      if (needsImmediateAttention) {
}
        console.log(&apos;\n⚠️  Mobile optimization required before production deployment!&apos;);
      } else {
}
        console.log(&apos;\n✨ Mobile responsiveness looks good! Ready for production.&apos;);
      }
    })
    .catch(error => {
}
      console.error(&apos;Fatal error during mobile testing:&apos;, error);
      process.exit(1);
    });
}
