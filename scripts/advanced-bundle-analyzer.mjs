/**
 * Advanced Bundle Analyzer and Performance Monitor
 * Provides comprehensive bundle analysis, performance metrics, and optimization recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BundleStats {
  totalSize: number;
  gzippedSize: number;
  chunkCount: number;
  assetCount: number;
  chunks: ChunkInfo[];
  assets: AssetInfo[];
  recommendations: string[];
}

interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  type: 'entry' | 'chunk' | 'asset';
  modules: string[];
}

interface AssetInfo {
  name: string;
  size: number;
  type: string;
}

class AdvancedBundleAnalyzer {
  private distPath: string;
  private stats: BundleStats;

  constructor() {
    this.distPath = path.join(__dirname, '../dist');
    this.stats = {
      totalSize: 0,
      gzippedSize: 0,
      chunkCount: 0,
      assetCount: 0,
      chunks: [],
      assets: [],
      recommendations: []
    };
  }

  async analyze(): Promise<BundleStats> {
    console.log('🔍 Starting advanced bundle analysis...');
    
    if (!fs.existsSync(this.distPath)) {
      throw new Error('❌ Dist directory not found. Please run "npm run build" first.');
    }

    await this.scanDirectory(this.distPath);
    this.generateRecommendations();
    this.generateReport();

    return this.stats;
  }

  private async scanDirectory(dirPath: string, relativePath = ''): Promise<void> {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const relativeFilePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath, relativeFilePath);
      } else {
        await this.analyzeFile(fullPath, relativeFilePath, stat.size);
      }
    }
  }

  private async analyzeFile(filePath: string, relativePath: string, size: number): Promise<void> {
    const ext = path.extname(filePath);
    const isJavaScript = ext === '.js';
    const isCSS = ext === '.css';
    const isAsset = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'].includes(ext);

    this.stats.totalSize += size;

    if (isJavaScript || isCSS) {
      // Estimate gzipped size (roughly 30% of original for text files)
      const estimatedGzippedSize = Math.round(size * 0.3);
      this.stats.gzippedSize += estimatedGzippedSize;

      const chunkInfo: ChunkInfo = {
        name: relativePath,
        size,
        gzippedSize: estimatedGzippedSize,
        type: relativePath.includes('entry') ? 'entry' : 'chunk',
        modules: this.extractModuleInfo(filePath)
      };

      this.stats.chunks.push(chunkInfo);
      this.stats.chunkCount++;
    }

    if (isAsset) {
      const assetInfo: AssetInfo = {
        name: relativePath,
        size,
        type: ext.slice(1)
      };

      this.stats.assets.push(assetInfo);
      this.stats.assetCount++;
    }
  }

  private extractModuleInfo(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const modules: string[] = [];

      // Extract import/require statements (simplified)
      const importMatches = content.match(/from\s+['"]([^'"]+)['"]/g);
      if (importMatches) {
        importMatches.forEach(match => {
          const moduleName = match.match(/from\s+['"]([^'"]+)['"]/)?.[1];
          if (moduleName && !moduleName.startsWith('.')) {
            modules.push(moduleName);
          }
        });
      }

      return [...new Set(modules)];
    } catch (error) {
      return [];
    }
  }

  private generateRecommendations(): void {
    const { chunks, totalSize, assets } = this.stats;
    const recommendations: string[] = [];

    // Check for large chunks
    const largeChunks = chunks.filter(chunk => chunk.size > 250 * 1024); // 250KB
    if (largeChunks.length > 0) {
      recommendations.push(
        `📦 ${largeChunks.length} chunks are larger than 250KB. Consider code splitting:`,
        ...largeChunks.map(chunk => `   • ${chunk.name}: ${this.formatSize(chunk.size)}`)
      );
    }

    // Check for duplicate dependencies
    const allModules = chunks.flatMap(chunk => chunk.modules);
    const moduleCount = allModules.reduce((acc, module) => {
      acc[module] = (acc[module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateModules = Object.entries(moduleCount)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a);

    if (duplicateModules.length > 0) {
      recommendations.push(
        `🔄 ${duplicateModules.length} modules appear in multiple chunks:`,
        ...duplicateModules.slice(0, 5).map(([module, count]) => `   • ${module}: ${count} chunks`)
      );
    }

    // Check total bundle size
    if (totalSize > 2 * 1024 * 1024) { // 2MB
      recommendations.push(
        `⚠️ Total bundle size (${this.formatSize(totalSize)}) exceeds 2MB`,
        '   Consider lazy loading non-critical features'
      );
    }

    // Check for large assets
    const largeAssets = assets.filter(asset => asset.size > 100 * 1024); // 100KB
    if (largeAssets.length > 0) {
      recommendations.push(
        `🖼️ ${largeAssets.length} assets are larger than 100KB:`,
        ...largeAssets.map(asset => `   • ${asset.name}: ${this.formatSize(asset.size)}`)
      );
    }

    // Performance score
    const performanceScore = this.calculatePerformanceScore();
    recommendations.push(`📊 Performance Score: ${performanceScore}/100`);

    this.stats.recommendations = recommendations;
  }

  private calculatePerformanceScore(): number {
    let score = 100;
    const { totalSize, chunks, gzippedSize } = this.stats;

    // Deduct points for large bundle size
    if (totalSize > 2 * 1024 * 1024) score -= 20;
    else if (totalSize > 1.5 * 1024 * 1024) score -= 15;
    else if (totalSize > 1 * 1024 * 1024) score -= 10;

    // Deduct points for large chunks
    const largeChunks = chunks.filter(chunk => chunk.size > 250 * 1024);
    score -= largeChunks.length * 5;

    // Deduct points for poor compression ratio
    const compressionRatio = gzippedSize / totalSize;
    if (compressionRatio > 0.4) score -= 10;
    else if (compressionRatio > 0.35) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  private generateReport(): void {
    console.log('\n📊 === ADVANCED BUNDLE ANALYSIS REPORT ===\n');

    // Summary
    console.log('📈 BUNDLE SUMMARY:');
    console.log(`   Total Size: ${this.formatSize(this.stats.totalSize)}`);
    console.log(`   Estimated Gzipped: ${this.formatSize(this.stats.gzippedSize)}`);
    console.log(`   Compression Ratio: ${((this.stats.gzippedSize / this.stats.totalSize) * 100).toFixed(1)}%`);
    console.log(`   JavaScript Chunks: ${this.stats.chunkCount}`);
    console.log(`   Static Assets: ${this.stats.assetCount}\n`);

    // Top 10 largest chunks
    console.log('📦 LARGEST CHUNKS:');
    const sortedChunks = [...this.stats.chunks].sort((a, b) => b.size - a.size);
    sortedChunks.slice(0, 10).forEach((chunk, index) => {
      console.log(`   ${index + 1}. ${chunk.name}: ${this.formatSize(chunk.size)} (gzipped: ${this.formatSize(chunk.gzippedSize)})`);
    });

    // Recommendations
    if (this.stats.recommendations.length > 0) {
      console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:');
      this.stats.recommendations.forEach(rec => {
        console.log(`   ${rec}`);
      });
    }

    // Save detailed report
    this.saveDetailedReport();
  }

  private saveDetailedReport(): void {
    const reportPath = path.join(this.distPath, 'bundle-analysis.json');
    const detailedReport = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      buildInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Performance monitoring utilities
export class ProductionPerformanceMonitor {
  private metrics: Record<string, number> = {};
  private observers: PerformanceObserver[] = [];

  initialize(): void {
    if (typeof window === 'undefined') return;

    this.setupPerformanceObservers();
    this.measureCoreWebVitals();
    this.monitorMemoryUsage();
    this.trackUserInteractions();
  }

  private setupPerformanceObservers(): void {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  private measureCoreWebVitals(): void {
    // Time to First Byte
    if ('navigation' in performance && 'getEntriesByType' in performance) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.metrics.domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart;
        this.metrics.loadComplete = navigationEntry.loadEventEnd - navigationStart;
      }
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsed = memory.usedJSHeapSize;
      this.metrics.memoryTotal = memory.totalJSHeapSize;
      this.metrics.memoryLimit = memory.jsHeapSizeLimit;
    }
  }

  private trackUserInteractions(): void {
    // Track long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.longTasks = (this.metrics.longTasks || 0) + entries.length;
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.warn('Long task observer not supported');
    }
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  generateReport(): void {
    console.log('\n🔍 === PRODUCTION PERFORMANCE METRICS ===\n');
    
    const formatMetric = (value: number, unit = 'ms') => `${value.toFixed(2)}${unit}`;
    
    console.log('⚡ Core Web Vitals:');
    if (this.metrics.lcp) console.log(`   LCP: ${formatMetric(this.metrics.lcp)} ${this.metrics.lcp > 2500 ? '❌' : this.metrics.lcp > 1200 ? '⚠️' : '✅'}`);
    if (this.metrics.fid) console.log(`   FID: ${formatMetric(this.metrics.fid)} ${this.metrics.fid > 100 ? '❌' : this.metrics.fid > 25 ? '⚠️' : '✅'}`);
    if (this.metrics.cls) console.log(`   CLS: ${this.metrics.cls.toFixed(3)} ${this.metrics.cls > 0.25 ? '❌' : this.metrics.cls > 0.1 ? '⚠️' : '✅'}`);
    
    console.log('\n🚀 Loading Performance:');
    if (this.metrics.ttfb) console.log(`   TTFB: ${formatMetric(this.metrics.ttfb)}`);
    if (this.metrics.domContentLoaded) console.log(`   DOM Ready: ${formatMetric(this.metrics.domContentLoaded)}`);
    if (this.metrics.loadComplete) console.log(`   Load Complete: ${formatMetric(this.metrics.loadComplete)}`);
    
    if (this.metrics.memoryUsed) {
      console.log('\n🧠 Memory Usage:');
      console.log(`   Used: ${(this.metrics.memoryUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Total: ${(this.metrics.memoryTotal / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new AdvancedBundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

export { AdvancedBundleAnalyzer, ProductionPerformanceMonitor };
