/**
 * Advanced Bundle Analyzer and Performance Monitor
 * Provides comprehensive bundle analysis, performance metrics, and optimization recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AdvancedBundleAnalyzer {
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

  async analyze() {
    console.log('🔍 Starting advanced bundle analysis...');
    
    if (!fs.existsSync(this.distPath)) {
      throw new Error('❌ Dist directory not found. Please run "npm run build" first.');
    }

    await this.scanDirectory(this.distPath);
    this.generateRecommendations();
    this.generateReport();

    return this.stats;
  }

  async scanDirectory(dirPath, relativePath = '') {
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

  async analyzeFile(filePath, relativePath, size) {
    const ext = path.extname(filePath);
    const isJavaScript = ext === '.js';
    const isCSS = ext === '.css';
    const isAsset = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'].includes(ext);

    this.stats.totalSize += size;

    if (isJavaScript || isCSS) {
      // Estimate gzipped size (roughly 30% of original for text files)
      const estimatedGzippedSize = Math.round(size * 0.3);
      this.stats.gzippedSize += estimatedGzippedSize;

      const chunkInfo = {
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
      const assetInfo = {
        name: relativePath,
        size,
        type: ext.slice(1)
      };

      this.stats.assets.push(assetInfo);
      this.stats.assetCount++;
    }
  }

  extractModuleInfo(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const modules = [];

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

  generateRecommendations() {
    const { chunks, totalSize, assets } = this.stats;
    const recommendations = [];

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
    }, {});

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

  calculatePerformanceScore() {
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

  generateReport() {
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

  saveDetailedReport() {
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

  formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new AdvancedBundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

export { AdvancedBundleAnalyzer };
