/**
 * Advanced Bundle Analyzer
 * Real-time bundle analysis and optimization recommendations
 */

interface BundleChunk {
  name: string;
  size: number;
  gzippedSize: number;
  type: 'vendor' | 'component' | 'service' | 'view' | 'other';
  priority: 'critical' | 'high' | 'medium' | 'low';
  loadTime?: number;
}

interface BundleAnalysis {
  totalSize: number;
  totalGzippedSize: number;
  chunks: BundleChunk[];
  recommendations: string[];
  performance: {
    score: number;
    metrics: { [key: string]: number };
  };
  optimization: {
    potentialSavings: number;
    criticalIssues: string[];
    suggestions: string[];
  };
}

class BundleAnalyzer {
  private chunks: BundleChunk[] = [];
  private loadTimes: Map<string, number> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAnalysis();
    }
  }

  /**
   * Initialize bundle analysis
   */
  private initializeAnalysis(): void {
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
    const scripts = Array.from(document.scripts);
    
    scripts.forEach(script => {
      if (script.src && script.src.includes('assets/')) {
        const resourceEntry = performance.getEntriesByName(script.src)[0] as PerformanceResourceTiming;
        
        if (resourceEntry) {
          const chunk = this.parseChunkFromScript(script, resourceEntry);
          if (chunk) {
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
    const src = script.src;
    const filename = src.split('/').pop() || '';
    
    // Extract chunk name and hash
    const chunkMatch = filename.match(/^([^-]+)(?:-[a-zA-Z0-9]+)?\.js$/);
    const chunkName = chunkMatch ? chunkMatch[1] : filename;
    
    // Determine chunk type and priority
    const { type, priority } = this.categorizeChunk(chunkName, filename);
    
    return {
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
  private categorizeChunk(chunkName: string, filename: string): { type: BundleChunk['type'], priority: BundleChunk['priority'] } {
    // Vendor chunks
    if (filename.includes('vendor') || chunkName.includes('vendor') || chunkName === 'react-vendor') {
      return { type: 'vendor', priority: 'critical' };
    }
    
    // Service chunks
    if (filename.includes('service') || chunkName.includes('services-chunk')) {
      return { type: 'service', priority: 'high' };
    }
    
    // View/Component chunks
    if (filename.includes('View') || chunkName.includes('chunk') || chunkName.includes('components')) {
      const priority = this.determineViewPriority(chunkName);
      return { type: chunkName.includes('View') ? 'view' : 'component', priority };
    }
    
    // Main app chunk
    if (chunkName === 'index') {
      return { type: 'other', priority: 'critical' };
    }
    
    return { type: 'other', priority: 'medium' };
  }

  /**
   * Determine priority for view chunks
   */
  private determineViewPriority(chunkName: string): BundleChunk['priority'] {
    const criticalViews = ['dashboard', 'team-hub', 'login'];
    const highPriorityViews = ['players', 'matchup', 'league-hub'];
    
    if (criticalViews.some(view => chunkName.toLowerCase().includes(view))) {
      return 'critical';
    }
    
    if (highPriorityViews.some(view => chunkName.toLowerCase().includes(view))) {
      return 'high';
    }
    
    return 'medium';
  }

  /**
   * Monitor chunk loading performance
   */
  private monitorChunkLoading(): void {
    // Override dynamic import to track loading
    const originalImport = window.import || (() => {});
    
    // Monitor script loading
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT' && element.getAttribute('src')?.includes('assets/')) {
              this.trackChunkLoad(element.getAttribute('src') || '');
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
    const startTime = performance.now();
    
    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (script) {
      script.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        const chunkName = src.split('/').pop() || '';
        this.loadTimes.set(chunkName, loadTime);
        
        console.log(`📦 Chunk loaded: ${chunkName} in ${loadTime.toFixed(2)}ms`);
      });
    }
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    if ('PerformanceObserver' in window) {
      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('assets/') && entry.name.endsWith('.js')) {
            this.updateChunkPerformance(entry as PerformanceResourceTiming);
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Update chunk performance data
   */
  private updateChunkPerformance(entry: PerformanceResourceTiming): void {
    const filename = entry.name.split('/').pop() || '';
    const chunkName = filename.split('-')[0];
    
    const chunk = this.chunks.find(c => c.name === chunkName);
    if (chunk) {
      chunk.loadTime = entry.responseEnd - entry.requestStart;
    }
  }

  /**
   * Analyze bundle performance
   */
  analyze(): BundleAnalysis {
    const totalSize = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzippedSize = this.chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    
    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(totalSize, totalGzippedSize);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations();
    
    // Calculate optimization potential
    const optimization = this.calculateOptimizationPotential();
    
    return {
      totalSize,
      totalGzippedSize,
      chunks: [...this.chunks].sort((a, b) => b.size - a.size),
      recommendations,
      performance: {
        score: performanceScore,
        metrics: this.getPerformanceMetrics()
      },
      optimization
    };
  }

  /**
   * Calculate performance score (0-100)
   */
  private calculatePerformanceScore(totalSize: number, totalGzippedSize: number): number {
    let score = 100;
    
    // Deduct points for large bundle sizes
    if (totalSize > 400 * 1024) { // 400KB threshold
      score -= Math.min(40, (totalSize - 400 * 1024) / (100 * 1024) * 10);
    }
    
    // Deduct points for poor gzip ratio
    const gzipRatio = totalGzippedSize / totalSize;
    if (gzipRatio > 0.3) { // Should be < 30%
      score -= Math.min(20, (gzipRatio - 0.3) * 100);
    }
    
    // Deduct points for too many chunks
    if (this.chunks.length > 20) {
      score -= Math.min(15, (this.chunks.length - 20) * 2);
    }
    
    // Deduct points for slow loading chunks
    const averageLoadTime = Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0) / this.loadTimes.size;
    if (averageLoadTime > 1000) { // 1s threshold
      score -= Math.min(25, (averageLoadTime - 1000) / 100);
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Get performance metrics
   */
  private getPerformanceMetrics(): { [key: string]: number } {
    const largestChunk = this.chunks.reduce((largest, chunk) => 
      chunk.size > largest.size ? chunk : largest, this.chunks[0]);
    
    const criticalChunks = this.chunks.filter(chunk => chunk.priority === 'critical');
    const criticalSize = criticalChunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    
    const averageLoadTime = this.loadTimes.size > 0 ? 
      Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0) / this.loadTimes.size : 0;
    
    return {
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
    const recommendations: string[] = [];
    const totalSize = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    
    // Bundle size recommendations
    if (totalSize > 500 * 1024) {
      recommendations.push('🔥 CRITICAL: Total bundle size exceeds 500KB - implement aggressive code splitting');
    } else if (totalSize > 300 * 1024) {
      recommendations.push('⚠️ Bundle size is large - consider additional code splitting');
    }
    
    // Large chunk recommendations
    const largeChunks = this.chunks.filter(chunk => chunk.size > 100 * 1024);
    largeChunks.forEach(chunk => {
      recommendations.push(`📦 Large chunk detected: ${chunk.name} (${(chunk.size / 1024).toFixed(0)}KB) - consider splitting`);
    });
    
    // Vendor chunk recommendations
    const vendorChunks = this.chunks.filter(chunk => chunk.type === 'vendor');
    const totalVendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalVendorSize > 300 * 1024) {
      recommendations.push('📚 Vendor bundles are large - separate framework code from other libraries');
    }
    
    // Loading performance recommendations
    const slowChunks = Array.from(this.loadTimes.entries()).filter(([, time]) => time > 2000);
    slowChunks.forEach(([chunkName, time]) => {
      recommendations.push(`⏱️ Slow loading chunk: ${chunkName} (${time.toFixed(0)}ms) - check network or compression`);
    });
    
    // Chunk count recommendations
    if (this.chunks.length < 5) {
      recommendations.push('🔀 Too few chunks - implement more granular code splitting for better caching');
    } else if (this.chunks.length > 25) {
      recommendations.push('🎯 Too many chunks - consolidate related functionality to reduce HTTP requests');
    }
    
    return recommendations;
  }

  /**
   * Calculate optimization potential
   */
  private calculateOptimizationPotential(): BundleAnalysis['optimization'] {
    const criticalIssues: string[] = [];
    const suggestions: string[] = [];
    let potentialSavings = 0;
    
    // Critical issues
    const totalSize = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalSize > 600 * 1024) {
      criticalIssues.push('Bundle size exceeds 600KB - immediate action required');
      potentialSavings += totalSize - 400 * 1024; // Target 400KB
    }
    
    // Large chunks that can be split
    const largeChunks = this.chunks.filter(chunk => chunk.size > 150 * 1024);
    if (largeChunks.length > 0) {
      criticalIssues.push(`${largeChunks.length} chunks exceed 150KB - split immediately`);
      potentialSavings += largeChunks.reduce((sum, chunk) => sum + chunk.size * 0.3, 0); // 30% estimated savings
    }
    
    // Optimization suggestions
    const vendorSize = this.chunks.filter(chunk => chunk.type === 'vendor').reduce((sum, chunk) => sum + chunk.size, 0);
    if (vendorSize > 200 * 1024) {
      suggestions.push('Split vendor libraries into multiple chunks based on usage patterns');
      potentialSavings += vendorSize * 0.2; // 20% estimated savings
    }
    
    const duplicatedLibraries = this.detectDuplicatedLibraries();
    if (duplicatedLibraries.length > 0) {
      suggestions.push(`Remove duplicated libraries: ${duplicatedLibraries.join(', ')}`);
      potentialSavings += duplicatedLibraries.length * 50 * 1024; // Estimated 50KB per duplicate
    }
    
    // Tree shaking opportunities
    const utilityChunks = this.chunks.filter(chunk => chunk.name.includes('utils') || chunk.name.includes('vendor'));
    if (utilityChunks.length > 0) {
      const avgUtilitySize = utilityChunks.reduce((sum, chunk) => sum + chunk.size, 0) / utilityChunks.length;
      if (avgUtilitySize > 80 * 1024) {
        suggestions.push('Improve tree shaking for utility libraries');
        potentialSavings += avgUtilitySize * 0.4; // 40% estimated savings
      }
    }
    
    return {
      potentialSavings,
      criticalIssues,
      suggestions
    };
  }

  /**
   * Detect duplicated libraries
   */
  private detectDuplicatedLibraries(): string[] {
    // This would need to analyze actual bundle contents
    // For now, return common duplicates
    const commonDuplicates = ['lodash', 'react', 'moment'];
    return commonDuplicates.filter(lib => {
      const libChunks = this.chunks.filter(chunk => chunk.name.toLowerCase().includes(lib));
      return libChunks.length > 1;
    });
  }

  /**
   * Generate detailed report
   */
  generateReport(): string {
    const analysis = this.analyze();
    
    let report = '📊 Bundle Analysis Report\\n';
    report += '=======================\\n\\n';
    
    // Overview
    report += `📦 Total Bundle Size: ${(analysis.totalSize / 1024).toFixed(2)} KB\\n`;
    report += `🗜️ Gzipped Size: ${(analysis.totalGzippedSize / 1024).toFixed(2)} KB\\n`;
    report += `📈 Performance Score: ${analysis.performance.score}/100\\n`;
    report += `🔢 Total Chunks: ${analysis.chunks.length}\\n\\n`;
    
    // Top 5 largest chunks
    report += '🏆 Largest Chunks:\\n';
    analysis.chunks.slice(0, 5).forEach((chunk, index) => {
      report += `${index + 1}. ${chunk.name}: ${(chunk.size / 1024).toFixed(2)} KB (${(chunk.gzippedSize / 1024).toFixed(2)} KB gzipped)\\n`;
    });
    report += '\\n';
    
    // Critical issues
    if (analysis.optimization.criticalIssues.length > 0) {
      report += '🚨 Critical Issues:\\n';
      analysis.optimization.criticalIssues.forEach(issue => {
        report += `   • ${issue}\\n`;
      });
      report += '\\n';
    }
    
    // Recommendations
    if (analysis.recommendations.length > 0) {
      report += '💡 Recommendations:\\n';
      analysis.recommendations.slice(0, 8).forEach(rec => {
        report += `   • ${rec}\\n`;
      });
      report += '\\n';
    }
    
    // Potential savings
    if (analysis.optimization.potentialSavings > 0) {
      report += `💰 Potential Savings: ${(analysis.optimization.potentialSavings / 1024).toFixed(2)} KB\\n\\n`;
    }
    
    // Performance metrics
    report += '📊 Performance Metrics:\\n';
    Object.entries(analysis.performance.metrics).forEach(([key, value]) => {
      const formattedValue = key.includes('Size') ? `${(value / 1024).toFixed(2)} KB` : 
                            key.includes('Time') ? `${value.toFixed(2)} ms` :
                            key.includes('Ratio') ? `${(value * 100).toFixed(1)}%` :
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