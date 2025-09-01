// CSS Optimization Utilities for Mobile Performance
// Identifies and helps eliminate unused CSS classes for better bundle size

interface CSSUsageAnalysis {
}
  usedClasses: string[];
  unusedClasses: string[];
  mobileSpecificClasses: string[];
  criticalClasses: string[];
}

/**
 * Analyzes CSS class usage across mobile-optimized components
 * Helps identify opportunities for CSS purging and optimization
 */
export class MobileCSSOptimizer {
}
  private static mobileBreakpoints = [&apos;sm:&apos;, &apos;md:&apos;, &apos;lg:&apos;, &apos;xl:&apos;, &apos;2xl:&apos;];
  private static criticalMobileClasses = [
    &apos;min-h-[44px]&apos;, // Touch targets
    &apos;grid-cols-1&apos;, &apos;sm:grid-cols-2&apos;, &apos;lg:grid-cols-3&apos;, // Responsive grids
    &apos;text-sm&apos;, &apos;sm:text-base&apos;, &apos;lg:text-lg&apos;, // Typography
    &apos;p-4&apos;, &apos;sm:p-6&apos;, &apos;lg:p-8&apos;, // Responsive padding
    &apos;w-full&apos;, &apos;sm:w-auto&apos;, // Width utilities
    &apos;flex-col&apos;, &apos;sm:flex-row&apos;, // Flex direction
    &apos;gap-2&apos;, &apos;gap-4&apos;, &apos;gap-6&apos;, // Spacing
    &apos;justify-center&apos;, &apos;sm:justify-between&apos;, // Justification
  ];

  /**
   * Scans component files for CSS class usage
   */
  static analyzeComponentCSSUsage(componentContent: string): CSSUsageAnalysis {
}
    const classMatches = componentContent.match(/className="([^"]+)"/g) || [];
    const allClasses = classMatches
      .map((match: any) => match.replace(/className="|"/g, &apos;&apos;))
      .flatMap(classes => classes.split(&apos; &apos;))
      .filter(Boolean);

    const uniqueClasses = [...new Set(allClasses)];
    
    const mobileSpecificClasses = uniqueClasses.filter((cls: any) => 
      this.mobileBreakpoints.some((bp: any) => cls.startsWith(bp))
    );

    const criticalClasses = uniqueClasses.filter((cls: any) =>
      this.criticalMobileClasses.includes(cls)
    );

    return {
}
      usedClasses: uniqueClasses,
      unusedClasses: [], // Would need full CSS bundle analysis
      mobileSpecificClasses,
//       criticalClasses
    };
  }

  /**
   * Generates critical CSS for mobile-first loading
   */
  static generateCriticalMobileCSS(): string {
}
    return `
/* Critical Mobile CSS - Inline for Performance */
.min-h-\\[44px\\] { min-height: 44px; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.p-4 { padding: 1rem; }
.w-full { width: 100%; }
.flex-col { flex-direction: column; }
.gap-2 { gap: 0.5rem; }
.justify-center { justify-content: center; }

/* Mobile breakpoint optimizations */
@media (min-width: 640px) {
}
  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\\:text-base { font-size: 1rem; line-height: 1.5rem; }
  .sm\\:p-6 { padding: 1.5rem; }
  .sm\\:w-auto { width: auto; }
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:justify-between { justify-content: space-between; }
}
`;
  }

  /**
   * Lazy loading helper for mobile-specific components
   */
  static createLazyMobileComponent<T>(
    importFn: () => Promise<{ default: React.ComponentType<T> }>,
    fallback?: React.ComponentType
  ) {
}
    return React.lazy(async () => {
}
      // Only load on mobile if needed
      if (window.innerWidth > 768) {
}
        return importFn();
      }
      
      // Add artificial delay to prevent loading flash
      await new Promise(resolve => setTimeout(resolve, 100));
      return importFn();
    });
  }

  /**
   * Performance monitoring utilities for mobile optimization
   */
  static measureMobilePerformance() {
}
    if (typeof window === &apos;undefined&apos;) return;

    const observer = new PerformanceObserver((list: any) => {
}
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
}
        if (entry.entryType === &apos;measure&apos; && entry.name.includes(&apos;mobile&apos;)) {
}
          console.log(`Mobile Performance: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: [&apos;measure&apos;] });
    
    return {
}
      markStart: (name: string) => performance.mark(`${name}-start`),
      markEnd: (name: string) => {
}
        performance.mark(`${name}-end`);
        performance.measure(
          `mobile-${name}`,
          `${name}-start`,
          `${name}-end`
        );
      }
    };
  }

  /**
   * Bundle size optimization recommendations
   */
  static getBundleOptimizationRecommendations(): {
}
    description: string;
    impact: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
    implementation: string;
  }[] {
}
    return [
      {
}
        description: &apos;Remove unused Tailwind CSS classes&apos;,
        impact: &apos;medium&apos;,
        implementation: &apos;Configure PurgeCSS or Tailwind purge options&apos;
      },
      {
}
        description: &apos;Implement code splitting for mobile-specific features&apos;,
        impact: &apos;high&apos;,
        implementation: &apos;Use React.lazy() for mobile modals and complex components&apos;
      },
      {
}
        description: &apos;Inline critical mobile CSS&apos;,
        impact: &apos;low&apos;,
        implementation: &apos;Extract and inline critical CSS for mobile breakpoints&apos;
      },
      {
}
        description: &apos;Tree-shake unused mobile utilities&apos;,
        impact: &apos;low&apos;,
        implementation: &apos;Ensure mobile optimization utilities are properly tree-shaken&apos;
      }
    ];
  }
}

// React import for lazy loading

export default MobileCSSOptimizer;
