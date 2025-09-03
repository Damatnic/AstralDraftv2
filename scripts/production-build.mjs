#!/usr/bin/env node

/**
 * Production Build & Optimization Script
 * Comprehensive production build process with optimization analysis
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n🚀 ${step}: ${description}`, colors.cyan);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function executeCommand(command, description) {
  try {
    log(`   Running: ${command}`, colors.blue);
    const output = execSync(command, { 
      cwd: PROJECT_ROOT, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    if (output.trim()) {
      console.log(output);
    }
    
    logSuccess(`${description} completed`);
    return true;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    return false;
  }
}

function checkFileExists(filePath, description) {
  const fullPath = path.resolve(PROJECT_ROOT, filePath);
  if (fs.existsSync(fullPath)) {
    logSuccess(`${description} exists`);
    return true;
  } else {
    logWarning(`${description} not found at ${filePath}`);
    return false;
  }
}

function getFileSize(filePath) {
  try {
    const fullPath = path.resolve(PROJECT_ROOT, filePath);
    const stats = fs.statSync(fullPath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  log('\n🏗️  === PRODUCTION BUILD & OPTIMIZATION PROCESS ===\n', colors.magenta);
  
  const startTime = Date.now();
  
  // Step 1: Pre-build checks
  logStep('Step 1', 'Pre-build Environment Checks');
  
  const nodeVersion = process.version;
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  
  log(`   Node.js version: ${nodeVersion}`);
  log(`   NPM version: ${npmVersion}`);
  
  if (!checkFileExists('package.json', 'package.json')) {
    logError('package.json not found. Are you in the correct directory?');
    process.exit(1);
  }
  
  // Step 2: Clean previous builds
  logStep('Step 2', 'Cleaning Previous Builds');
  executeCommand('npm run clean', 'Clean previous builds');
  
  // Step 3: Type checking
  logStep('Step 3', 'TypeScript Type Checking');
  if (!executeCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript type checking')) {
    logWarning('Type checking failed, but continuing with build...');
  }
  
  // Step 4: Production build
  logStep('Step 4', 'Production Build');
  if (!executeCommand('npm run build', 'Vite production build')) {
    logError('Production build failed!');
    process.exit(1);
  }
  
  // Step 5: Build verification
  logStep('Step 5', 'Build Verification');
  
  const distPath = 'dist';
  if (!checkFileExists(distPath, 'Dist directory')) {
    logError('Build output directory not found!');
    process.exit(1);
  }
  
  checkFileExists('dist/index.html', 'Main HTML file');
  
  // Check for critical assets
  const assetsPath = 'dist/assets';
  if (fs.existsSync(path.resolve(PROJECT_ROOT, assetsPath))) {
    const assets = fs.readdirSync(path.resolve(PROJECT_ROOT, assetsPath));
    const jsFiles = assets.filter(file => file.endsWith('.js'));
    const cssFiles = assets.filter(file => file.endsWith('.css'));
    
    log(`   JavaScript files: ${jsFiles.length}`);
    log(`   CSS files: ${cssFiles.length}`);
    
    // Check for main chunks
    const mainChunk = jsFiles.find(file => file.includes('index'));
    if (mainChunk) {
      const size = getFileSize(`dist/assets/${mainChunk}`);
      log(`   Main chunk size: ${formatBytes(size)}`);
      
      if (size > 1024 * 1024) { // 1MB
        logWarning(`Main chunk is large (${formatBytes(size)}). Consider code splitting.`);
      }
    }
  }
  
  // Step 6: Bundle analysis
  logStep('Step 6', 'Bundle Analysis');
  try {
    if (checkFileExists('scripts/advanced-bundle-analyzer.js', 'Bundle analyzer')) {
      executeCommand('node scripts/advanced-bundle-analyzer.js', 'Bundle analysis');
    } else {
      logWarning('Bundle analyzer not found, skipping analysis');
    }
  } catch (error) {
    logWarning('Bundle analysis failed, but build succeeded');
  }
  
  // Step 7: Size report
  logStep('Step 7', 'Build Size Report');
  
  const totalSize = getTotalDirectorySize(path.resolve(PROJECT_ROOT, 'dist'));
  log(`   Total build size: ${formatBytes(totalSize)}`);
  
  // Step 8: Performance recommendations
  logStep('Step 8', 'Performance Recommendations');
  
  const recommendations = [];
  
  if (totalSize > 5 * 1024 * 1024) { // 5MB
    recommendations.push('Consider reducing bundle size (current: ' + formatBytes(totalSize) + ')');
  }
  
  if (!checkFileExists('dist/sw.js', 'Service Worker')) {
    recommendations.push('Consider adding a Service Worker for caching');
  }
  
  // Check for gzip compression (would be server-side)
  recommendations.push('Ensure gzip/brotli compression is enabled on your server');
  recommendations.push('Configure proper cache headers for static assets');
  recommendations.push('Consider using a CDN for asset delivery');
  
  if (recommendations.length > 0) {
    log('\n   💡 Performance Recommendations:');
    recommendations.forEach(rec => log(`      • ${rec}`));
  }
  
  // Step 9: Deployment readiness check
  logStep('Step 9', 'Deployment Readiness Check');
  
  const deploymentChecks = [
    { file: 'dist/index.html', name: 'Main HTML file' },
    { file: 'dist/favicon.svg', name: 'Favicon' },
    { file: 'netlify.toml', name: 'Netlify configuration' }
  ];
  
  let deploymentReady = true;
  deploymentChecks.forEach(check => {
    if (!checkFileExists(check.file, check.name)) {
      deploymentReady = false;
    }
  });
  
  // Final summary
  const buildTime = Date.now() - startTime;
  
  log('\n📊 === BUILD SUMMARY ===\n', colors.magenta);
  log(`   Build time: ${(buildTime / 1000).toFixed(2)}s`);
  log(`   Total size: ${formatBytes(totalSize)}`);
  log(`   Deployment ready: ${deploymentReady ? '✅ Yes' : '❌ No'}`);
  
  if (deploymentReady) {
    logSuccess('\n🎉 Production build completed successfully!');
    log('\n   Next steps:', colors.cyan);
    log('   1. Test the build locally: npm run preview');
    log('   2. Deploy to your hosting platform');
    log('   3. Monitor performance metrics in production');
  } else {
    logWarning('\n⚠️ Build completed with warnings. Please address issues before deployment.');
  }
  
  return deploymentReady;
}

function getTotalDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        calculateSize(path.join(currentPath, file));
      });
    }
  }
  
  try {
    calculateSize(dirPath);
  } catch (error) {
    log(`Error calculating directory size: ${error.message}`, colors.red);
  }
  
  return totalSize;
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`Build script failed: ${error.message}`);
    process.exit(1);
  });
}
