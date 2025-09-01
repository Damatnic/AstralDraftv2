/**
 * Advanced Bundle Analyzer
 * Real-time bundle analysis and optimization recommendations
 */

interface BundleChunk {
}
  name: string;
  size: number;
  gzippedSize: number;
  type: &apos;vendor&apos; | &apos;component&apos; | &apos;service&apos; | &apos;view&apos; | &apos;other&apos;;
  priority: &apos;critical&apos; | &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  loadTime?: number;
}

interface BundleAnalysis {
}
  totalSize: number;
  totalGzippedSize: number;
  chunks: BundleChunk[];
  recommendations: string[];
  performance: {
}
    score: number;
    metrics: { [key: string]: number };
  };
  optimization: {
}
    potentialSavings: number;
    criticalIssues: string[];
    suggestions: string[];
  };
}

class BundleAnalyzer {
}
  private chunks: BundleChunk[] = [];
  private loadTimes: Map<string, number> = new Map();

  constructor() {
}
    if (typeof window !== &apos;undefined&apos;) {
}
      this.initializeAnalysis();
    }
  }

  /**
   * Initialize bundle analysis
   */
  private initializeAnalysis(): void {
}
    // Analyze loaded scripts
    this.analyzeLoadedChunks();
    
    // Monitor chunk loading performance
    this.monitorChunkLoading();
    
    // Setup performance observers
    this.setupPerformanceObservers();
  }

  /**
   * Analyze currently loaded chunks
   */
  private analyzeLoadedChunks(): void {
}
    const scripts = Array.from(document.scripts);
    
    scripts.forEach((script: any) => {
}
      if (script.src && script.src.includes(&apos;assets/&apos;)) {
}
        const resourceEntry = performance.getEntriesByName(script.src)[0] as PerformanceResourceTiming;
        
        if (resourceEntry) {
}
          const chunk = this.parseChunkFromScript(script, resourceEntry);
          if (chunk) {
}
            this.chunks.push(chunk);
          }
        }
      }
    });
  }

  /**
   * Parse chunk information from script element
   */
  private parseChunkFromScript(script: HTMLScriptElement, resourceEntry: PerformanceResourceTiming): BundleChunk | null {
}
    const src = script.src;
    const filename = src.split(&apos;/&apos;).pop() || &apos;&apos;;
    
    // Extract chunk name and hash
    const chunkMatch = filename.match(/^([^-]+)(?:-[a-zA-Z0-9]+)?\.js$/);
    const chunkName = chunkMatch ? chunkMatch[1] : filename;
    
    // Determine chunk type and priority
    const { type, priority } = this.categorizeChunk(chunkName, filename);
    
    return {
}
      name: chunkName,
      size: resourceEntry.decodedBodySize || 0,
      gzippedSize: resourceEntry.transferSize || 0,
      type,
      priority,
      loadTime: resourceEntry.responseEnd - resourceEntry.requestStart
    };
  }

  /**
   * Categorize chunk by type and priority
   */
  private categorizeChunk(chunkName: string, filename: string): { type: BundleChunk[&apos;type&apos;], priority: BundleChunk[&apos;priority&apos;] } {
}
    // Vendor chunks
    if (filename.includes(&apos;vendor&apos;) || chunkName.includes(&apos;vendor&apos;) || chunkName === &apos;react-vendor&apos;) {
}
      return { type: &apos;vendor&apos;, priority: &apos;critical&apos; };
    }
    
    // Service chunks
    if (filename.includes(&apos;service&apos;) || chunkName.includes(&apos;services-chunk&apos;)) {
}
      return { type: &apos;service&apos;, priority: &apos;high&apos; };
    }
    
    // View/Component chunks
    if (filename.includes(&apos;View&apos;) || chunkName.includes(&apos;chunk&apos;) || chunkName.includes(&apos;components&apos;)) {
}
      const priority = this.determineViewPriority(chunkName);
      return { type: chunkName.includes(&apos;View&apos;) ? &apos;view&apos; : &apos;component&apos;, priority };
    }
    
    // Main app chunk
    if (chunkName === &apos;index&apos;) {
}
      return { type: &apos;other&apos;, priority: &apos;critical&apos; };
    }
    
    return { type: &apos;other&apos;, priority: &apos;medium&apos; };
  }

  /**
   * Determine priority for view chunks
   */
  private determineViewPriority(chunkName: string): BundleChunk[&apos;priority&apos;] {
}
    const criticalViews = [&apos;dashboard&apos;, &apos;team-hub&apos;, &apos;login&apos;];
    const highPriorityViews = [&apos;players&apos;, &apos;matchup&apos;, &apos;league-hub&apos;];
    
    if (criticalViews.some((view: any) => chunkName.toLowerCase().includes(view))) {
}
      return &apos;critical&apos;;
    }
    
    if (highPriorityViews.some((view: any) => chunkName.toLowerCase().includes(view))) {
}
      return &apos;high&apos;;
    }
    
    return &apos;medium&apos;;
  }

  /**
   * Monitor chunk loading performance
   */
  private monitorChunkLoading(): void {
}
    // Override dynamic import to track loading
    const originalImport = window.import || (() => {});
    
    // Monitor script loading
    const observer = new MutationObserver((mutations: any) => {
}
      mutations.forEach((mutation: any) => {
}
        mutation.addedNodes.forEach((node: any) => {
}
          if (node.nodeType === Node.ELEMENT_NODE) {
}
            const element = node as Element;
            if (element.tagName === &apos;SCRIPT&apos; && element.getAttribute(&apos;src&apos;)?.includes(&apos;assets/&apos;)) {
}
              this.trackChunkLoad(element.getAttribute(&apos;src&apos;) || &apos;&apos;);
            }
          }
        });
      });
    });
    
    observer.observe(document.head, { childList: true });
  }

  /**
   * Track individual chunk loading
   */
  private trackChunkLoad(src: string): void {
}
    const startTime = performance.now();
    
    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (script) {
}
      script.addEventListener(&apos;load&apos;, () => {
}
        const loadTime = performance.now() - startTime;
        const chunkName = src.split(&apos;/&apos;).pop() || &apos;&apos;;
        this.loadTimes.set(chunkName, loadTime);
        
        console.log(`📦 Chunk loaded: ${chunkName} in ${loadTime.toFixed(2)}ms`);
      });
    }
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
}
    if (&apos;PerformanceObserver&apos; in window) {
}
      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list: any) => {
}
        list.getEntries().forEach((entry: any) => {
}
          if (entry.name.includes(&apos;assets/&apos;) && entry.name.endsWith(&apos;.js&apos;)) {
}
            this.updateChunkPerformance(entry as PerformanceResourceTiming);
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: [&apos;resource&apos;] });
    }
  }

  /**
   * Update chunk performance data
   */
  private updateChunkPerformance(entry: PerformanceResourceTiming): void {
}
    const filename = entry.name.split(&apos;/&apos;).pop() || &apos;&apos;;
    const chunkName = filename.split(&apos;-&apos;)[0];
    
    const chunk = this.chunks.find((c: any) => c.name === chunkName);
    if (chunk) {
}
      chunk.loadTime = entry.responseEnd - entry.requestStart;
    }
  }

  /**
   * Analyze bundle performance
   */
  analyze(): BundleAnalysis {
}
    const totalSize = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzippedSize = this.chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    
    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(totalSize, totalGzippedSize);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations();
    
    // Calculate optimization potential
    const optimization = this.calculateOptimizationPotential();
    
    return {
}
      totalSize,
      totalGzippedSize,
      chunks: [...this.chunks].sort((a, b) => b.size - a.size),
      recommendations,
      performance: {
}
        score: performanceScore,
        metrics: this.getPerformanceMetrics()
      },
//       optimization
    };
  }

  /**
   * Calculate performance score (0-100)
   */
  private calculatePerformanceScore(totalSize: number, totalGzippedSize: number): number {
}
    let score = 100;
    
    // Deduct points for large bundle sizes
    if (totalSize > 400 * 1024) { // 400KB threshold
}
      score -= Math.min(40, (totalSize - 400 * 1024) / (100 * 1024) * 10);
    }
    
    // Deduct points for poor gzip ratio
    const gzipRatio = totalGzippedSize / totalSize;
    if (gzipRatio > 0.3) { // Should be < 30%
}
      score -= Math.min(20, (gzipRatio - 0.3) * 100);
    }
    
    // Deduct points for too many chunks
    if (this.chunks.length > 20) {
}
      score -= Math.min(15, (this.chunks.length - 20) * 2);
    }
    
    // Deduct points for slow loading chunks
    const averageLoadTime = Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0) / this.loadTimes.size;
    if (averageLoadTime > 1000) { // 1s threshold
}
      score -= Math.min(25, (averageLoadTime - 1000) / 100);
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Get performance metrics
   */
  private getPerformanceMetrics(): { [key: string]: number } {
}
    const largestChunk = this.chunks.reduce((largest, chunk) => 
      chunk.size > largest.size ? chunk : largest, this.chunks[0]);
    
    const criticalChunks = this.chunks.filter((chunk: any) => chunk.priority === &apos;critical&apos;);
    const criticalSize = criticalChunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    
    const averageLoadTime = this.loadTimes.size > 0 ? 
      Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0) / this.loadTimes.size : 0;
    
    return {
}
      totalChunks: this.chunks.length,
      largestChunkSize: largestChunk?.size || 0,
      criticalPathSize: criticalSize,
      averageLoadTime,
      gzipRatio: this.chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0) / 
                 this.chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(): string[] {
}
    const recommendations: string[] = [];
    const totalSize = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    
    // Bundle size recommendations
    if (totalSize > 500 * 1024) {
}
      recommendations.push(&apos;🔥 CRITICAL: Total bundle size exceeds 500KB - implement aggressive code splitting&apos;);
    } else if (totalSize > 300 * 1024) {
}
      recommendations.push(&apos;⚠️ Bundle size is large - consider additional code splitting&apos;);
    }
    
    // Large chunk recommendations
    const largeChunks = this.chunks.filter((chunk: any) => chunk.size > 100 * 1024);
    largeChunks.forEach((chunk: any) => {
}
      recommendations.push(`📦 Large chunk detected: ${chunk.name} (${(chunk.size / 1024).toFixed(0)}KB) - consider splitting`);
    });
    
    // Vendor chunk recommendations
    const vendorChunks = this.chunks.filter((chunk: any) => chunk.type === &apos;vendor&apos;);
    const totalVendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalVendorSize > 300 * 1024) {
}
      recommendations.push(&apos;📚 Vendor bundles are large - separate framework code from other libraries&apos;);
    }
    
    // Loading performance recommendations
    const slowChunks = Array.from(this.loadTimes.entries()).filter(([, time]) => time > 2000);
    slowChunks.forEach(([chunkName, time]) => {
}
      recommendations.push(`⏱️ Slow loading chunk: ${chunkName} (${time.toFixed(0)}ms) - check network or compression`);
    });
    
    // Chunk count recommendations
    if (this.chunks.length < 5) {
}
      recommendations.push(&apos;🔀 Too few chunks - implement more granular code splitting for better caching&apos;);
    } else if (this.chunks.length > 25) {
}
      recommendations.push(&apos;🎯 Too many chunks - consolidate related functionality to reduce HTTP requests&apos;);
    }
    
    return recommendations;
  }

  /**
   * Calculate optimization potential
   */
  private calculateOptimizationPotential(): BundleAnalysis[&apos;optimization&apos;] {
}
    const criticalIssues: string[] = [];
    const suggestions: string[] = [];
    let potentialSavings = 0;
    
    // Critical issues
    const totalSize = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalSize > 600 * 1024) {
}
      criticalIssues.push(&apos;Bundle size exceeds 600KB - immediate action required&apos;);
      potentialSavings += totalSize - 400 * 1024; // Target 400KB
    }
    
    // Large chunks that can be split
    const largeChunks = this.chunks.filter((chunk: any) => chunk.size > 150 * 1024);
    if (largeChunks.length > 0) {
}
      criticalIssues.push(`${largeChunks.length} chunks exceed 150KB - split immediately`);
      potentialSavings += largeChunks.reduce((sum, chunk) => sum + chunk.size * 0.3, 0); // 30% estimated savings
    }
    
    // Optimization suggestions
    const vendorSize = this.chunks.filter((chunk: any) => chunk.type === &apos;vendor&apos;).reduce((sum, chunk) => sum + chunk.size, 0);
    if (vendorSize > 200 * 1024) {
}
      suggestions.push(&apos;Split vendor libraries into multiple chunks based on usage patterns&apos;);
      potentialSavings += vendorSize * 0.2; // 20% estimated savings
    }
    
    const duplicatedLibraries = this.detectDuplicatedLibraries();
    if (duplicatedLibraries.length > 0) {
}
      suggestions.push(`Remove duplicated libraries: ${duplicatedLibraries.join(&apos;, &apos;)}`);
      potentialSavings += duplicatedLibraries.length * 50 * 1024; // Estimated 50KB per duplicate
    }
    
    // Tree shaking opportunities
    const utilityChunks = this.chunks.filter((chunk: any) => chunk.name.includes(&apos;utils&apos;) || chunk.name.includes(&apos;vendor&apos;));
    if (utilityChunks.length > 0) {
}
      const avgUtilitySize = utilityChunks.reduce((sum, chunk) => sum + chunk.size, 0) / utilityChunks.length;
      if (avgUtilitySize > 80 * 1024) {
}
        suggestions.push(&apos;Improve tree shaking for utility libraries&apos;);
        potentialSavings += avgUtilitySize * 0.4; // 40% estimated savings
      }
    }
    
    return {
}
      potentialSavings,
      criticalIssues,
//       suggestions
    };
  }

  /**
   * Detect duplicated libraries
   */
  private detectDuplicatedLibraries(): string[] {
}
    // This would need to analyze actual bundle contents
    // For now, return common duplicates
    const commonDuplicates = [&apos;lodash&apos;, &apos;react&apos;, &apos;moment&apos;];
    return commonDuplicates.filter((lib: any) => {
}
      const libChunks = this.chunks.filter((chunk: any) => chunk.name.toLowerCase().includes(lib));
      return libChunks.length > 1;
    });
  }

  /**
   * Generate detailed report
   */
  generateReport(): string {
}
    const analysis = this.analyze();
    
    let report = &apos;📊 Bundle Analysis Report\\n&apos;;
    report += &apos;=======================\\n\\n&apos;;
    
    // Overview
    report += `📦 Total Bundle Size: ${(analysis.totalSize / 1024).toFixed(2)} KB\\n`;
    report += `🗜️ Gzipped Size: ${(analysis.totalGzippedSize / 1024).toFixed(2)} KB\\n`;
    report += `📈 Performance Score: ${analysis.performance.score}/100\\n`;
    report += `🔢 Total Chunks: ${analysis.chunks.length}\\n\\n`;
    
    // Top 5 largest chunks
    report += &apos;🏆 Largest Chunks:\\n&apos;;
    analysis.chunks.slice(0, 5).forEach((chunk, index) => {
}
      report += `${index + 1}. ${chunk.name}: ${(chunk.size / 1024).toFixed(2)} KB (${(chunk.gzippedSize / 1024).toFixed(2)} KB gzipped)\\n`;
    });
    report += &apos;\\n&apos;;
    
    // Critical issues
    if (analysis.optimization.criticalIssues.length > 0) {
}
      report += &apos;🚨 Critical Issues:\\n&apos;;
      analysis.optimization.criticalIssues.forEach((issue: any) => {
}
        report += `   • ${issue}\\n`;
      });
      report += &apos;\\n&apos;;
    }
    
    // Recommendations
    if (analysis.recommendations.length > 0) {
}
      report += &apos;💡 Recommendations:\\n&apos;;
      analysis.recommendations.slice(0, 8).forEach((rec: any) => {
}
        report += `   • ${rec}\\n`;
      });
      report += &apos;\\n&apos;;
    }
    
    // Potential savings
    if (analysis.optimization.potentialSavings > 0) {
}
      report += `💰 Potential Savings: ${(analysis.optimization.potentialSavings / 1024).toFixed(2)} KB\\n\\n`;
    }
    
    // Performance metrics
    report += &apos;📊 Performance Metrics:\\n&apos;;
    Object.entries(analysis.performance.metrics).forEach(([key, value]) => {
}
      const formattedValue = key.includes(&apos;Size&apos;) ? `${(value / 1024).toFixed(2)} KB` : 
                            key.includes(&apos;Time&apos;) ? `${value.toFixed(2)} ms` :
                            key.includes(&apos;Ratio&apos;) ? `${(value * 100).toFixed(1)}%` :
                            value.toString();
      report += `   • ${key}: ${formattedValue}\\n`;
    });
    
    return report;
  }
}

// Create singleton instance
export const bundleAnalyzer = new BundleAnalyzer();

// Convenience functions
export const analyzeBundles = () => bundleAnalyzer.analyze();
export const generateBundleReport = () => bundleAnalyzer.generateReport();

export default BundleAnalyzer;